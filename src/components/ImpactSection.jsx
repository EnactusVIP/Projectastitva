import { useEffect, useRef, useState } from 'react';
import styles from './ImpactSection.module.css';

const IMPACT_STATS = [
  {
    target: 120,
    suffix: '+',
    label: 'Community Members',
    sublabel: 'Engaged across dialogue & sensitivity circles',
  },
  {
    target: 4,
    suffix: '',
    label: 'UN SDGs Aligned',
    sublabel: 'Health, Education, Equality & Justice',
  },
  {
    target: 24,
    suffix: '/7',
    label: 'Digital Sanctuary',
    sublabel: 'Continuous private guidance via Saathi AI',
  },
  {
    target: 100,
    suffix: '%',
    label: 'Confidential Care',
    sublabel: 'Judgment-free space where your story is protected',
  },
];

export default function ImpactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      setCounts(IMPACT_STATS.map((s) => s.target));
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
        threshold: 0.15,
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

  // Smooth subtle count-up when section enters viewport
  useEffect(() => {
    if (!isVisible) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setCounts(IMPACT_STATS.map((s) => s.target));
      return;
    }

    const duration = 1200;
    const startTimestamp = performance.now();

    const animateCount = (now) => {
      const elapsed = now - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setCounts(
        IMPACT_STATS.map((s) => Math.round(s.target * easeProgress))
      );

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCounts(IMPACT_STATS.map((s) => s.target));
      }
    };

    requestAnimationFrame(animateCount);
  }, [isVisible]);

  return (
    <section
      id="mission"
      ref={sectionRef}
      className={styles.section}
      aria-label="Our Mission and Impact"
    >
      {/* Subtle ambient light gradient */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={`${styles.header} ${isVisible ? styles.revealed : ''}`}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span className={styles.eyebrow}>OUR MISSION &amp; IMPACT</span>
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

        {/* Subtle hairline separator */}
        <div className={`${styles.statsDivider} ${isVisible ? styles.dividerDrawn : ''}`} aria-hidden="true" />

        {/* Approved Impact Evidence Grid */}
        <div className={styles.statsGrid}>
          {IMPACT_STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`${styles.statCard} ${isVisible ? styles.statVisible : ''}`}
              style={{ transitionDelay: isVisible ? `${index * 100 + 200}ms` : '0ms' }}
            >
              <div className={styles.statNumberRow}>
                <span className={styles.statNumber}>{counts[index]}</span>
                {stat.suffix && <span className={styles.statSuffix}>{stat.suffix}</span>}
              </div>
              <h3 className={styles.statLabel}>{stat.label}</h3>
              <p className={styles.statSublabel}>{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
