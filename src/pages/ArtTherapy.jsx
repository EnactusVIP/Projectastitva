import { useEffect, useState } from 'react';
import styles from './ArtTherapy.module.css';

export default function ArtTherapy({ onNavigate }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Staggered sequence for a quiet, atmospheric entrance
    const t1 = setTimeout(() => setStage(1), 100);  // Background resolves
    const t2 = setTimeout(() => setStage(2), 350);  // Eyebrow fades in
    const t3 = setTimeout(() => setStage(3), 700);  // Coming Soon reveals
    const t4 = setTimeout(() => setStage(4), 1100); // Supporting sentence
    const t5 = setTimeout(() => setStage(5), 1400); // Organic line draws itself
    const t6 = setTimeout(() => setStage(6), 2000); // Secondary / action detail

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
    <div className={`${styles.pageContainer} ${stage >= 1 ? styles.stageBgReady : ''}`}>
      <main className={styles.mainStage} aria-label="Art Therapy Coming Soon">
        {/* Subtle atmospheric ambient glow */}
        <div className={styles.ambientGlow} aria-hidden="true" />

        <div className={styles.contentCard}>
          {/* Eyebrow */}
          <div className={`${styles.eyebrowWrapper} ${stage >= 2 ? styles.visible : ''}`}>
            <span className={styles.eyebrow}>ART THERAPY</span>
          </div>

          {/* Heading with organic artistic motif behind/framing it */}
          <div className={styles.headingBlock}>
            {/* Artistic Visual Motif: single delicate organic curve drawn once */}
            <svg
              className={`${styles.artMotif} ${stage >= 5 ? styles.drawMotif : ''}`}
              viewBox="0 0 840 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="artStrokeGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#F4C400" stopOpacity="0" />
                  <stop offset="20%" stopColor="#F4C400" stopOpacity="0.75" />
                  <stop offset="55%" stopColor="#F4C400" stopOpacity="0.95" />
                  <stop offset="85%" stopColor="#F4C400" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#F4C400" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 60 155 C 160 215, 280 180, 390 125 C 490 75, 590 65, 680 115 C 740 148, 780 130, 800 100"
                className={styles.drawnStroke}
                pathLength="1000"
              />
              <path
                d="M 90 170 C 200 205, 310 165, 420 138 C 530 110, 630 115, 730 142"
                className={styles.echoStroke}
                pathLength="1000"
              />
            </svg>

            <h1 className={`${styles.title} ${stage >= 3 ? styles.visible : ''}`}>
              COMING SOON
            </h1>
          </div>

          {/* Supporting sentence */}
          <p className={`${styles.statement} ${stage >= 4 ? styles.visible : ''}`}>
            &ldquo;A new space for expression, reflection and creativity.&rdquo;
          </p>

          {/* Secondary / Action Detail */}
          <div className={`${styles.bottomDetail} ${stage >= 6 ? styles.visible : ''}`}>
            <span className={styles.detailText}>Something thoughtful is taking shape.</span>
            <div className={styles.actionsRow}>
              <button
                type="button"
                className={styles.primaryActionBtn}
                onClick={handleToSupport}
                aria-label="Explore Support Services"
              >
                <span>Explore Support Services</span>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className={styles.inProgressAction}
                onClick={handleBackToHome}
                aria-label="Return to Project Astitva Home"
              >
                <span className={styles.inProgressLine} aria-hidden="true" />
                <span className={styles.inProgressText}>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
