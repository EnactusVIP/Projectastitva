import { useEffect, useState } from 'react';
import styles from './ArtTherapy.module.css';

export default function ArtTherapy({ onNavigate }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Staggered sequence for a quiet, atmospheric entrance
    const t1 = setTimeout(() => setStage(1), 80);   // Canvas ready
    const t2 = setTimeout(() => setStage(2), 250);  // Eyebrow & badge
    const t3 = setTimeout(() => setStage(3), 500);  // Display headline
    const t4 = setTimeout(() => setStage(4), 850);  // Editorial quotes & copy
    const t5 = setTimeout(() => setStage(5), 1100); // Filament stroke & artwork
    const t6 = setTimeout(() => setStage(6), 1400); // Editorial links & actions

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []);

  const handleBackToHome = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onNavigate) {
      onNavigate('home', '#home');
    } else {
      window.location.hash = '#home';
    }
  };

  const handleToSupport = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onNavigate) {
      onNavigate('support', '#support');
    } else {
      window.location.hash = '#support';
    }
  };

  return (
    <div className={`${styles.pageContainer} ${stage >= 1 ? styles.stageReady : ''}`}>
      <main className={styles.editorialStage} aria-label="Art Therapy — Forthcoming Space">
        {/* Subtle ambient light field behind the composition */}
        <div className={styles.ambientGlow} aria-hidden="true" />

        <div className={styles.editorialGrid}>
          {/* Left Column: Primary Editorial Statement */}
          <div className={styles.editorialColumnMain}>
            {/* Eyebrow and Status */}
            <div className={`${styles.eyebrowRow} ${stage >= 2 ? styles.visible : ''}`}>
              <span className={styles.eyebrow}>ART THERAPY / FORTHCOMING SPACE</span>
              <span className={styles.eyebrowDivider} aria-hidden="true">•</span>
              <span className={styles.phaseBadge}>PHASE 02</span>
            </div>

            {/* Display Headline with flowing filament behind */}
            <div className={styles.heroHeadlineWrapper}>
              <svg
                className={`${styles.filamentLine} ${stage >= 5 ? styles.drawFilament : ''}`}
                viewBox="0 0 640 260"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="artTherapyFilament" x1="0%" y1="30%" x2="100%" y2="70%">
                    <stop offset="0%" stopColor="#F4C400" stopOpacity="0" />
                    <stop offset="25%" stopColor="#F4C400" stopOpacity="0.65" />
                    <stop offset="65%" stopColor="#E29A26" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#F4C400" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 20 180 C 130 230, 240 170, 340 105 C 440 45, 520 75, 610 135"
                  stroke="url(#artTherapyFilament)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.drawnFilament}
                  pathLength="1000"
                />
                <path
                  d="M 50 198 C 160 220, 275 145, 400 90 C 480 58, 545 85, 595 115"
                  stroke="#F4C400"
                  strokeWidth="0.75"
                  strokeOpacity="0.28"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  className={styles.echoFilament}
                />
              </svg>

              <h1 className={`${styles.headline} ${stage >= 3 ? styles.visible : ''}`}>
                <span className={styles.headlineLine}>COMING</span>
                <span className={styles.headlineLine}>SOON</span>
              </h1>
            </div>

            {/* Supporting quote */}
            <blockquote className={`${styles.quoteBlock} ${stage >= 4 ? styles.visible : ''}`}>
              <p className={styles.quoteText}>
                &ldquo;A new space for expression, reflection and creativity.&rdquo;
              </p>
            </blockquote>

            {/* Human note */}
            <p className={`${styles.humanNote} ${stage >= 4 ? styles.visible : ''}`}>
              We are shaping a guided creative therapy initiative for students and young adults
              seeking gentle, non-verbal paths to emotional wellbeing and self-discovery.
            </p>

            {/* Editorial text links (no heavy buttons) */}
            <div className={`${styles.actionsRow} ${stage >= 6 ? styles.visible : ''}`}>
              <a
                href="#support"
                className={styles.primaryEditorialLink}
                onClick={handleToSupport}
                aria-label="Explore Support Services"
              >
                <span className={styles.linkText}>Explore Support Services</span>
                <span className={styles.linkArrow} aria-hidden="true">→</span>
              </a>

              <button
                type="button"
                className={styles.secondaryEditorialLink}
                onClick={handleBackToHome}
                aria-label="Return to Home"
              >
                <span className={styles.linkLine} aria-hidden="true" />
                <span className={styles.linkText}>Return to Home</span>
              </button>
            </div>
          </div>

          {/* Right Column: Abstract Line-Art Counterweight */}
          <aside
            className={`${styles.editorialColumnAside} ${stage >= 5 ? styles.visible : ''}`}
            aria-label="Artistic Impression"
          >
            <div className={styles.artCompositionFrame}>
              <svg
                className={styles.artVisualSvg}
                viewBox="0 0 380 420"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="artAura" cx="50%" cy="45%" r="50%">
                    <stop offset="0%" stopColor="#F4C400" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#F4C400" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Soft ambient center circle */}
                <circle cx="190" cy="200" r="140" fill="url(#artAura)" />

                {/* Fine structural register hairlines */}
                <line x1="30" y1="200" x2="350" y2="200" stroke="#E3DED4" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="190" y1="40" x2="190" y2="360" stroke="#E3DED4" strokeWidth="0.8" strokeDasharray="3 3" />

                {/* Meditative organic enso gesture */}
                <path
                  d="M 190 70 C 265 70, 320 125, 320 200 C 320 280, 255 330, 180 330 C 105 330, 60 268, 65 195 C 70 120, 130 75, 185 70"
                  stroke="#242424"
                  strokeWidth="1.2"
                  strokeOpacity="0.22"
                  strokeLinecap="round"
                  className={styles.sculpturePathPrimary}
                />

                {/* Warm golden fluid brush stroke */}
                <path
                  d="M 95 240 C 135 150, 175 120, 220 160 C 260 195, 290 170, 305 130"
                  stroke="#F4C400"
                  strokeWidth="1.6"
                  strokeOpacity="0.65"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.sculpturePathAccent}
                />

                {/* Secondary gentle wave */}
                <path
                  d="M 120 270 C 170 305, 230 285, 275 245"
                  stroke="#8A5A2B"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                />

                {/* Focal stillness point */}
                <circle cx="190" cy="200" r="3.5" fill="#F4C400" />
                <circle cx="190" cy="200" r="12" stroke="#F4C400" strokeWidth="0.75" strokeOpacity="0.4" />
              </svg>

              <div className={styles.artCaption}>
                <span className={styles.captionNumber}>01 — SANCTUARY FOR CREATIVE CARE</span>
                <p className={styles.captionText}>
                  A quiet space dedicated to guided non-verbal expression, contemplative practices, and gentle community healing.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
