# Project Astitva — Google Sheets Community Signup Setup Guide

This guide explains how to connect the "Join Our Community" signup form to your Google Sheet using a secure Google Cloud Service Account.

---

## Architecture Overview
```
Frontend (CommunityJoinModal)
       ↓
POST /api/community-signup (Vercel Serverless Function)
       ↓
Google Sheets API v4 (Authenticated via RS256 Service Account JWT)
       ↓
Target Google Sheet ("Community Signups" tab)
```

No secrets or credentials are ever exposed in the client-side bundle or public code.

---

## Step-by-Step Setup

### Step 1: Create or Select a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top and click **New Project**.
3. Name your project (e.g. `project-astitva-community`) and click **Create**.

---

### Step 2: Enable the Google Sheets API
1. In the Google Cloud Console, navigate to **APIs & Services** > **Library**.
2. Search for **Google Sheets API**.
3. Select it and click **Enable**.

---

### Step 3: Create a Service Account
1. Navigate to **APIs & Services** > **Credentials**.
2. Click **Create Credentials** at the top and select **Service Account**.
3. Fill in the details:
   - **Service account name**: e.g., `astitva-sheet-writer`
   - **Service account ID**: will automatically populate (e.g. `astitva-sheet-writer@project-astitva-community.iam.gserviceaccount.com`).
4. Click **Create and Continue**.
5. (Optional) For role, you may select **Project > Viewer** or leave it blank (the service account only needs access to the specific spreadsheet you share with it).
6. Click **Done**.

---

### Step 4: Generate and Download Service Account JSON Key
1. Under **Credentials** > **Service Accounts**, click on the newly created service account email.
2. Go to the **Keys** tab.
3. Click **Add Key** > **Create new key**.
4. Choose **JSON** format and click **Create**.
5. A `.json` key file will download to your computer.
   
> [!CAUTION]
> Keep this file private. Never commit this JSON file to GitHub or share it publicly.

---

### Step 5: Create and Share Your Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new sheet (e.g. name it `Project Astitva — Community Members`).
2. Click the **Share** button in the top right corner.
3. Paste the **client_email** of your service account (e.g. `astitva-sheet-writer@project-astitva-community.iam.gserviceaccount.com`).
4. Set permission to **Editor** and uncheck "Notify people".
5. Click **Share**.
6. Copy the **Spreadsheet ID** from the sheet's URL:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
                                          ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
                                          This is your GOOGLE_SHEET_ID
   ```

> [!NOTE]
> You do **not** need to create the `"Community Signups"` tab or column headers manually!
> The API automatically verifies if the tab exists, creates it if missing, and initializes the header columns:
> `Timestamp | Full Name | Phone Number | City | Consent`

---

### Step 6: Configure Environment Variables in Vercel
1. Log into your [Vercel Dashboard](https://vercel.com/dashboard) and navigate to your **Project Astitva** project.
2. Go to **Settings** > **Environment Variables**.
3. Add the following three variables:

| Variable Name | Value Description | Example / Source |
|---|---|---|
| `GOOGLE_SHEET_ID` | The alphanumeric ID from your Google Sheet URL | `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs...` |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | The `client_email` field from your service account JSON | `astitva-sheet-writer@...iam.gserviceaccount.com` |
| `GOOGLE_SHEETS_PRIVATE_KEY` | The `private_key` field from your service account JSON | `"-----BEGIN PRIVATE KEY-----\nMIIEvgIB...-----END PRIVATE KEY-----\n"` |

> [!TIP]
> When pasting `GOOGLE_SHEETS_PRIVATE_KEY` into Vercel, copy the entire string including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`. If it contains `\n` characters, Vercel and the backend parser will automatically handle them.

---

### Step 7: Local Development Testing (Optional)
For testing locally with Vite:
1. Create a `.env.local` file in the project root (this file is gitignored):
   ```env
   GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email@...
   GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173/project-astitva/#home`, click the community logo, fill in the form, and submit. The row will immediately appear in your Google Sheet!

---

### Step 8: Verify Live Submissions
1. Visit the live site: [https://projectastitva.vercel.app/#home](https://projectastitva.vercel.app/#home)
2. Click the circular Project Astitva community logo in the Hero section.
3. Fill out the fields:
   - Full Name: `Test Community Member`
   - Phone Number: `9876543210`
   - City: `New Delhi`
   - Consent: Checked
4. Click **JOIN THE COMMUNITY →**.
5. Confirm that the success screen appears ("YOU'RE IN. Welcome to the Astitva community.").
6. Check your Google Sheet — the entry will be written under the `Community Signups` tab with an IST server timestamp!
