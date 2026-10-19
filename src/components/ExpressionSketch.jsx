export default function ExpressionSketch() {
  return (
<svg viewBox="0 0 540 470" fill="none" role="img" aria-labelledby="expression-sketch-title">
  <title id="expression-sketch-title">Hand-drawn open sketchbook with a flower, an expressive line, a heart and a pencil</title>
  {/* Original drawing: an open sketchbook, a pencil, and an unfolding line. */}
  <path d="M86 118c45-15 105-8 161 20l-14 245c-53-26-108-33-157-16z" fill="var(--panel)"/>
  <path d="M247 138c58-17 118-13 164 6l-8 244c-54-19-111-22-170-5z" fill="var(--commitment)"/>
  <g stroke="var(--forest)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M86 118c45-15 105-8 161 20 58-17 118-13 164 6l-8 244c-54-19-111-22-170-5-53-26-108-33-157-16z"/>
    <path d="m247 138-14 245m-150-9-8 7c57-16 108-6 157 16 58-17 117-16 174 1l6-8"/>
    <path d="M110 151c34-4 64 2 99 16M108 160l25 1" opacity=".6"/>
    <path d="M294 191c-17-22-44 6-15 25l24 20 30-22c29-24 2-49-18-26l-10 11z" stroke="var(--accent)"/>
    <path d="M280 274c19-32 64-26 54 1-10 29-58 18-49 43 10 26 58 15 66-10" stroke="var(--accent)" strokeWidth="3"/>
    <path d="M125 262c-16-8-12-30 1-32 14-2 19 13 16 25 7-28 32-28 34-13 2 13-20 23-28 24 32-7 42 12 30 23-13 12-29-7-35-18 8 24-10 40-21 27-10-12 5-27 15-30-20 9-37-2-30-15" stroke="var(--sage-ink)"/>
    <path d="m144 268-7 57m-1-16c-16-17-28-14-24-6 4 9 16 10 24 10m2-12c18-14 25-7 20-1-6 7-13 6-20 6" stroke="var(--sage-ink)"/>
    <path d="M353 116c-25-23-39-42-18-60 22-19 57-4 49 17-10 25-61 19-72-7-12-30 19-49 46-42" stroke="var(--accent)" strokeWidth="2.5"/>
    <path d="m423 308 47-167 13 4-47 167-12 17z" fill="var(--sage)"/>
    <path d="m470 141 3-12c3-8 16-5 14 3l-4 13m-59 184 3-12 9-5m-12 17-1 5m51-180-41 146"/>
    <path d="M59 226c-14-15-14-28-1-39m390-96 12-9m-18-2 1-14M194 70l6-15m7 23 13-6" stroke="var(--sage-ink)"/>
  </g>
  <path d="M100 421c94 13 236 13 331-1" stroke="var(--sage)" strokeWidth="1.5" strokeLinecap="round"/>
</svg>

  );
}
