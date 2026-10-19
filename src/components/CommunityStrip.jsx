import { useEffect, useRef, useState } from 'react';
import communityStripImg from '../assets/community-strip.png';
import styles from './CommunityStrip.module.css';

/**
 * CommunityStrip Component
 *
 * The absolute last visual element on every page, positioned directly
 * below the entire Footer. Spans full viewport width with a subtle
 * scroll-triggered entrance animation.
 */
export default function CommunityStrip({ show = true, className = '' }) {
  const stripRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

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
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  if (!show) return null;

  return (
    <section
      ref={stripRef}
      className={`${styles.communityStrip} ${
        isVisible ? styles.visible : ''
      } ${className}`.trim()}
      aria-label="Project Astitva community illustration"
    >
      <div className={styles.imageContainer}>
        <img
          src={communityStripImg}
          alt="Illustration of diverse people standing together representing community, inclusion, and belonging"
          className={styles.stripImage}
          loading="lazy"
        />
      </div>
    </section>
  );
}
