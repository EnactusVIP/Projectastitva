import { useState, useEffect, useRef } from 'react';
import astitvaHeroBg from '../assets/astitva-hero.png';
import astitvaLogo from '../assets/astitva-logo.png';
import CommunityJoinModal from './CommunityJoinModal';
import styles from './Hero.module.css';

export default function Hero({ onNavigate }) {
  const [stage, setStage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logoTriggerRef = useRef(null);

  useEffect(() => {
    // Cinematic, staged entrance sequence completed under 1.5s
    const t1 = setTimeout(() => setStage(1), 80);   // Image & background resolves
    const t2 = setTimeout(() => setStage(2), 220);  // Atmosphere overlay settles
    const t3 = setTimeout(() => setStage(3), 420);  // Eyebrow appears
    const t4 = setTimeout(() => setStage(4), 650);  // Project Astitva title reveals
    const t5 = setTimeout(() => setStage(5), 900);  // Tagline reveals
    const t6 = setTimeout(() => setStage(6), 1150); // Astitva identity badge appears
    const t7 = setTimeout(() => setStage(7), 1380); // Interactive scroll cue resolves

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, []);

  const handleScrollCue = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const target = document.getElementById('about') || document.querySelector('main > section:nth-of-type(2)');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const handleBadgeClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <section id="home" className={styles.hero} aria-label="Hero — Project Astitva">
      {/* Background illustration with multi-level atmospheric overlays */}
      <div className={styles.bgWrapper} aria-hidden="true">
        <img
          src={astitvaHeroBg}
          alt="Diverse LGBTQ+ community celebrating together"
          className={`${styles.bgImage} ${stage >= 1 ? styles.bgLoaded : ''}`}
          loading="eager"
        />
        {/* Multi-level overlay: subtle base tint, central radial vignette, and bottom fade */}
        <div className={`${styles.overlayBase} ${stage >= 2 ? styles.overlayLoaded : ''}`} />
        <div className={`${styles.overlayRadial} ${stage >= 2 ? styles.overlayLoaded : ''}`} />
        <div className={styles.bottomFade} />
      </div>

      {/* Main Hero Content Stage */}
      <div className={styles.heroStage}>
        <div className={styles.editorialCard}>
          {/* Eyebrow */}
          <div className={`${styles.eyebrowWrapper} ${stage >= 3 ? styles.visible : ''}`}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span className={styles.eyebrow}>PROJECT ASTITVA</span>
            <span className={styles.eyebrowLine} aria-hidden="true" />
          </div>

          {/* Dominant Title & Tagline Hierarchy */}
          <div className={styles.titleWrapper}>
            <h1 className={`${styles.title} ${stage >= 4 ? styles.visible : ''}`}>
              Project Astitva
            </h1>
            <p className={`${styles.tagline} ${stage >= 5 ? styles.visible : ''}`}>
              exist as you are.
            </p>
          </div>
        </div>

        {/* Secondary Floating Identity Marker (Circular Community Badge) */}
        <div className={`${styles.badgeWrapper} ${stage >= 6 ? styles.visible : ''}`}>
          <button
            type="button"
            ref={logoTriggerRef}
            className={`${styles.badgeButton} ${isModalOpen ? styles.badgeActive : ''}`}
            aria-label="Open Project Astitva Community Signup Modal"
            onClick={handleBadgeClick}
          >
            <div className={styles.badgeGlow} aria-hidden="true" />
            <div className={styles.badgeCircle}>
              <img
                src={astitvaLogo}
                alt="Project Astitva community mark"
                className={styles.badgeImage}
              />
            </div>
            <span className={styles.badgeTooltip} aria-hidden="true">
              Join Our Community &rarr;
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Hero Scroll Cue */}
      <div className={`${styles.scrollCueWrapper} ${stage >= 7 ? styles.visible : ''}`}>
        <button
          type="button"
          className={styles.scrollCueButton}
          onClick={handleScrollCue}
          aria-label="Scroll to explore the story of Project Astitva"
        >
          <span className={styles.scrollCueText}>SCROLL TO EXPLORE</span>
          <div className={styles.scrollCueIndicator} aria-hidden="true">
            <span className={styles.scrollCueLine} />
            <span className={styles.scrollCueDot} />
          </div>
        </button>
      </div>

      {/* Community Join Modal */}
      <CommunityJoinModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        triggerRef={logoTriggerRef}
      />
    </section>
  );
}
