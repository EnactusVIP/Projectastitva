import { useEffect, useRef, useState } from 'react';
import styles from './AstitvaIntro.module.css';

export default function AstitvaIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.18,
        rootMargin: '-5% 0px -10% 0px',
      }
    );

    const currentElement = sectionRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, []);

  return (
    <section
      id="about"
      className={styles.section}
      ref={sectionRef}
      aria-label="Astitva Philosophy"
    >
      {/* Subtle ambient light gradient for smooth tonal transition from Hero */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Step 1: Eyebrow Heading */}
        <div className={`${styles.headingBlock} ${isVisible ? styles.revealed : ''}`}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          <h2 className={styles.heading}>
            <span className={styles.latinTitle}>ASTITVA</span>
            <span className={styles.separator} aria-hidden="true">|</span>
            <span className={styles.hindiTitle} lang="hi">अस्तित्व</span>
          </h2>
          <span className={styles.eyebrowDot} aria-hidden="true" />
        </div>

        {/* Step 2: Dominant English Quote as a Statement */}
        <blockquote className={`${styles.englishQuote} ${isVisible ? styles.revealed : ''}`}>
          &ldquo;I am the path that has not been paved yet but I will be the identity that can never be erased&rdquo;
        </blockquote>

        {/* Step 3: Hindi Companion Line (Subordinated in scale and tone) */}
        <p className={`${styles.hindiQuote} ${isVisible ? styles.revealed : ''}`} lang="hi">
          &ldquo;मैं वो राह हूँ जो अभी बनी नहीं, मैं वो अस्तित्व हूँ जो कभी मिटेगा नहीं।&rdquo;
        </p>

        {/* Step 4: Three Core Brand Pillars */}
        <div className={`${styles.pillarsRow} ${isVisible ? styles.revealed : ''}`} aria-label="Astitva Pillars">
          <span className={styles.pillarItem}>Existence</span>
          <span className={styles.pillarDot} aria-hidden="true">•</span>
          <span className={styles.pillarItem}>Identity</span>
          <span className={styles.pillarDot} aria-hidden="true">•</span>
          <span className={styles.pillarItem}>Belonging</span>
        </div>

        {/* Step 5: Thin Gold Hairline that slowly draws across */}
        <div className={styles.dividerContainer} aria-hidden="true">
          <div className={`${styles.drawingLine} ${isVisible ? styles.lineDrawn : ''}`} />
        </div>
      </div>
    </section>
  );
}
