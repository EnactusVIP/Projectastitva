import { useEffect, useRef, useState } from 'react';
import styles from './ImpactSection.module.css';

export default function ImpactSection() {
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
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        threshold: 0.18,
        rootMargin: '-5% 0px -10% 0px',
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section
      id="mission"
      ref={sectionRef}
      className={styles.section}
      aria-label="Our Mission"
    >
      {/* Subtle ambient light gradient */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={`${styles.header} ${isVisible ? styles.revealed : ''}`}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span className={styles.eyebrow}>OUR MISSION</span>
            <span className={styles.eyebrowLine} aria-hidden="true" />
          </div>
          <h2 className={styles.headline}>
            A world where every identity <em className={styles.headlineItalic}>is celebrated</em>
          </h2>
        </div>

        {/* Existing approved mission statement */}
        <div className={`${styles.missionBlock} ${isVisible ? styles.revealed : ''}`}>
          <blockquote className={styles.missionQuote}>
            &ldquo;To create a world where every individual can exist authentically &mdash; free from prejudice, discrimination, and fear. Project Astitva stands as a testament to the belief that identity is not a choice to be judged, but a truth to be celebrated.&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}
