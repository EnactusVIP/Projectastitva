import crypto from 'crypto';

/**
 * Generate an RS256-signed JWT for Google OAuth2 Service Account
 */
function createSignedJwt(clientEmail, rawPrivateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };
  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsignedToken = `${encode(header)}.${encode(claimSet)}`;

  let formattedKey = rawPrivateKey.trim();
  if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
    formattedKey = formattedKey.slice(1, -1);
  }
  formattedKey = formattedKey.replace(/\\n/g, '\n');

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsignedToken);
  sign.end();

  const signature = sign.sign(formattedKey, 'base64url');
  return `${unsignedToken}.${signature}`;
}

/**
 * Exchange signed JWT for a Google OAuth2 access token
 */
async function getGoogleAccessToken(clientEmail, privateKey) {
  const jwt = createSignedJwt(clientEmail, privateKey);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || data.error || 'Failed to obtain Google access token');
  }
  return data.access_token;
}

/**
 * Ensure the "Community Signups" tab exists in the target spreadsheet
 */
async function ensureSheetTabExists(sheetId, accessToken) {
  const TAB_NAME = 'Community Signups';
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=sheets.properties.title`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const meta = await metaRes.json();
  if (!metaRes.ok) {
    throw new Error(meta.error?.message || 'Failed to fetch spreadsheet metadata');
  }

  const tabExists = meta.sheets?.some((s) => s.properties?.title === TAB_NAME);
  if (!tabExists) {
    // 1. Add new sheet tab
    const addRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: TAB_NAME,
              },
            },
          },
        ],
      }),
    });

    if (!addRes.ok) {
      const addData = await addRes.json();
      throw new Error(addData.error?.message || 'Failed to create "Community Signups" sheet tab');
    }

    // 2. Add header row
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/'${TAB_NAME}'!A1:E1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [['Timestamp', 'Full Name', 'Phone Number', 'City', 'Consent']],
        }),
      }
    );
  }

  return TAB_NAME;
}

/**
 * Append row to Google Sheet
 */
async function appendRowToSheet(sheetId, accessToken, tabName, rowData) {
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/'${tabName}'!A:E:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowData],
      }),
    }
  );

  const appendData = await appendRes.json();
  if (!appendRes.ok) {
    throw new Error(appendData.error?.message || 'Failed to append row to Google Sheet');
  }
  return appendData;
}

/**
 * Main Vercel Serverless Function Handler
 */
export default async function handler(req, res) {
  // Enforce POST method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid JSON request body' });
      }
    }
    body = body || {};

    const { name, phone, city, consent, website_url } = body;

    // 1. Anti-spam honeypot check: reject if hidden field is filled
    if (website_url) {
      // Return 200 to trick spam bots without saving
      return res.status(200).json({ success: true, message: 'Received' });
    }

    // 2. Validate Full Name
    const cleanName = typeof name === 'string' ? name.trim() : '';
    if (!cleanName || cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid full name (2–80 characters).',
      });
    }

    // 3. Validate and normalize Indian Phone Number
    const rawPhone = typeof phone === 'string' ? phone.trim() : '';
    // Strip spaces, dashes, parentheses
    const strippedPhone = rawPhone.replace(/[\s\-()]/g, '');
    // Check valid Indian mobile number: 10 digits starting with 6, 7, 8, 9, optionally prefixed by +91 or 0
    const phoneRegex = /^(?:\+91|91|0)?([6-9]\d{9})$/;
    const phoneMatch = strippedPhone.match(phoneRegex);
    if (!phoneMatch) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit phone number.',
      });
    }
    const cleanPhone = phoneMatch[1]; // 10-digit normalized phone number

    // 4. Validate City
    const cleanCity = typeof city === 'string' ? city.trim() : '';
    if (!cleanCity || cleanCity.length < 2 || cleanCity.length > 80) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid city name.',
      });
    }

    // 5. Consent value
    const consentValue = Boolean(consent) ? 'Yes' : 'No';

    // 6. Server-side timestamp (India Standard Time UTC+5:30)
    const now = new Date();
    const istOptions = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    let timestamp = '';
    try {
      const parts = new Intl.DateTimeFormat('en-CA', istOptions).formatToParts(now);
      const part = (t) => parts.find((p) => p.type === t)?.value || '';
      timestamp = `${part('year')}-${part('month')}-${part('day')} ${part('hour')}:${part('minute')}:${part('second')} IST`;
    } catch {
      timestamp = now.toISOString();
    }

    // 7. Check Google Sheets Credentials
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

    if (!sheetId || !clientEmail || !privateKey) {
      console.warn('Google Sheets environment variables are missing (GOOGLE_SHEET_ID, GOOGLE_SHEETS_CLIENT_EMAIL, or GOOGLE_SHEETS_PRIVATE_KEY).');
      return res.status(503).json({
        success: false,
        message: 'Google Sheets integration is not configured on the server. Please verify environment variables.',
      });
    }

    // 8. Authenticate and write to Google Sheet
    const accessToken = await getGoogleAccessToken(clientEmail, privateKey);
    const tabName = await ensureSheetTabExists(sheetId, accessToken);
    await appendRowToSheet(sheetId, accessToken, tabName, [
      timestamp,
      cleanName,
      cleanPhone,
      cleanCity,
      consentValue,
    ]);

    return res.status(200).json({
      success: true,
      message: 'Successfully joined the community!',
    });
  } catch (error) {
    console.error('Community signup API error:', error.message || error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while saving your details. Please try again later.',
    });
  }
}
