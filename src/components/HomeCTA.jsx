import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './HomeCTA.module.css';

export default function HomeCTA({ onNavigate }) {
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
        threshold: 0.2,
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

  const handleSupportClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onNavigate) {
      onNavigate('support');
    } else {
      window.location.hash = '#support';
    }
  };

  const handleStoryClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onNavigate) {
      onNavigate('about');
    } else {
      window.location.hash = '#about';
    }
  };

  return (
    <section
      className={styles.section}
      ref={sectionRef}
      aria-label="Invitation to Connect"
    >
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={`${styles.container} ${isVisible ? styles.revealed : ''}`}>
        {/* Eyebrow */}
        <div className={styles.eyebrowRow}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          <span className={styles.eyebrow}>WHERE YOU COME IN</span>
          <span className={styles.eyebrowLine} aria-hidden="true" />
        </div>

        {/* Minimal Emotional Headline */}
        <h2 className={styles.headline}>
          There is always space for <em className={styles.headlineItalic}>one more story.</em>
        </h2>

        {/* Supporting Human Statement */}
        <p className={styles.subtext}>
          Whether you need a listening ear, a compassionate community, or a space to simply be yourself &mdash; you belong here.
        </p>

        {/* Actions */}
        <div className={styles.actionGroup}>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={handleSupportClick}
            aria-label="Find Support - Go to Support Page"
          >
            <span className={styles.actionLine} aria-hidden="true" />
            <span className={styles.actionText}>FIND SUPPORT</span>
            <ArrowRight size={16} className={styles.actionArrow} aria-hidden="true" />
          </button>

          <button
            type="button"
            className={styles.secondaryAction}
            onClick={handleStoryClick}
            aria-label="Explore Our Story - Go to About Us Page"
          >
            <span>Explore our story</span>
            <ArrowRight size={14} className={styles.secondaryArrow} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
