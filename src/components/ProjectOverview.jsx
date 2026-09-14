import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './ProjectOverview.module.css';

const IMPACT_AREAS = [
  {
    number: '01',
    id: 'awareness',
    title: 'Awareness',
    description:
      'Creating safe spaces and spreading awareness about LGBTQ+ rights, identities, and inclusion across communities.',
    actionLabel: 'Explore Our Story',
    targetPage: 'about',
    targetHash: '#about',
  },
  {
    number: '02',
    id: 'education',
    title: 'Education',
    description:
      'Conducting workshops, seminars, and outreach programs to educate and empower individuals about gender and sexuality.',
    actionLabel: 'Learn Our Approach',
    targetPage: 'about',
    targetHash: '#about',
  },
  {
    number: '03',
    id: 'support',
    title: 'Support',
    description:
      'Building a compassionate support network for individuals navigating their identity journey, ensuring no one walks alone.',
    actionLabel: 'Find Support',
    targetPage: 'support',
    targetHash: '#support',
  },
];

export default function ProjectOverview({ onNavigate }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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
        threshold: 0.14,
        rootMargin: '-5% 0px -10% 0px',
      }
    );

    const element = sectionRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const handleClick = (e, area) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onNavigate) {
      onNavigate(area.targetPage);
    } else {
      window.location.hash = area.targetHash;
    }
  };

  return (
    <section
      id="what-we-do"
      ref={sectionRef}
      className={styles.section}
      aria-label="What We Do Impact Areas"
    >
      <div className={styles.container}>
        {/* Section Header */}
        <div className={`${styles.header} ${isVisible ? styles.revealed : ''}`}>
          <div className={styles.eyebrowRow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            <span className={styles.eyebrow}>WHAT WE DO</span>
            <span className={styles.eyebrowLine} aria-hidden="true" />
          </div>
          <h2 className={styles.headline}>
            Three pillars of <em className={styles.headlineItalic}>purpose &amp; action</em>
          </h2>
        </div>

        {/* Editorial Horizontal Rows */}
        <div className={styles.rowsList}>
          {IMPACT_AREAS.map((area, index) => (
            <article
              key={area.id}
              className={`${styles.row} ${isVisible ? styles.rowVisible : ''}`}
              style={{ transitionDelay: isVisible ? `${index * 140 + 100}ms` : '0ms' }}
              onClick={(e) => handleClick(e, area)}
              tabIndex={0}
              role="button"
              aria-label={`${area.title}: ${area.description}. Click to ${area.actionLabel}.`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick(e, area);
                }
              }}
            >
              {/* Top hairline border with animated gold glow on hover */}
              <div className={styles.rowBorderTop} aria-hidden="true">
                <div className={styles.rowBorderGlow} />
              </div>

              <div className={styles.rowInner}>
                {/* Number */}
                <div className={styles.numberCol}>
                  <span className={styles.number}>{area.number}</span>
                </div>

                {/* Title */}
                <div className={styles.titleCol}>
                  <h3 className={styles.title}>{area.title}</h3>
                </div>

                {/* Description */}
                <div className={styles.descCol}>
                  <p className={styles.description}>{area.description}</p>
                </div>

                {/* Interactive Action Indicator */}
                <div className={styles.actionCol}>
                  <span className={styles.actionText}>{area.actionLabel}</span>
                  <div className={styles.arrowCircle}>
                    <ArrowRight size={15} className={styles.arrowIcon} aria-hidden="true" />
                  </div>
                </div>
              </div>
            </article>
          ))}
          {/* Closing bottom hairline */}
          <div className={`${styles.bottomHairline} ${isVisible ? styles.revealed : ''}`} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
