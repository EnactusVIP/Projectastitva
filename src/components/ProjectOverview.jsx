import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './ProjectOverview.module.css';

const CHAPTERS = [
  {
    number: '01',
    id: 'awareness',
    concept: 'Understanding',
    title: 'Awareness',
    statement: 'Creating space for every identity to be seen.',
    description:
      'Creating safe spaces and spreading awareness about LGBTQ+ rights, identities, and inclusion across communities.',
    actionLabel: 'Explore our story',
    targetPage: 'about',
    targetHash: '#about',
  },
  {
    number: '02',
    id: 'education',
    concept: 'Learning',
    title: 'Education',
    statement: 'Understanding creates the possibility of change.',
    description:
      'Conducting workshops, seminars, and outreach programs to educate and empower individuals about gender and sexuality.',
    actionLabel: 'Explore our approach',
    targetPage: 'about',
    targetHash: '#about',
  },
  {
    number: '03',
    id: 'support',
    concept: 'Care',
    title: 'Support',
    statement: 'No one should have to navigate identity alone.',
    description:
      'Building a compassionate support network for individuals navigating their identity journey, ensuring no one walks alone.',
    actionLabel: 'Find support & care',
    targetPage: 'support',
    targetHash: '#support',
  },
];

export default function ProjectOverview({ onNavigate }) {
  const sectionRef = useRef(null);
  const chapterRefs = useRef([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const manualClickTimerRef = useRef(null);
  const isManualClickRef = useRef(false);

  // Section entrance reveal
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
        threshold: 0.08,
        rootMargin: '-5% 0px -10% 0px',
      }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  // Scroll observer to activate chapters as user scrolls naturally
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const chapterObserver = new IntersectionObserver(
      (entries) => {
        if (isManualClickRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-chapter-index'));
            if (!isNaN(index)) {
              setActiveChapter(index);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -40% 0px',
        threshold: 0.2,
      }
    );

    chapterRefs.current.forEach((el) => {
      if (el) chapterObserver.observe(el);
    });

    return () => {
      chapterRefs.current.forEach((el) => {
        if (el) chapterObserver.unobserve(el);
      });
    };
  }, []);

  const handleChapterClick = useCallback((index) => {
    isManualClickRef.current = true;
    setActiveChapter(index);

    if (manualClickTimerRef.current) clearTimeout(manualClickTimerRef.current);
    manualClickTimerRef.current = setTimeout(() => {
      isManualClickRef.current = false;
    }, 1200);
  }, []);

  const handleNavigate = useCallback(
    (chapter, e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      if (e && e.preventDefault) e.preventDefault();

      if (onNavigate) {
        onNavigate(chapter.targetPage);
      } else {
        window.location.hash = chapter.targetHash;
      }
    },
    [onNavigate]
  );

  return (
    <section
      id="what-we-do"
      ref={sectionRef}
      className={styles.section}
      aria-label="What We Do — Three Chapters of Action"
    >
      {/* Master Container: Single parent container defining the global boundary */}
      <div className={styles.container}>
        {/* Section Header: Aligned with the master grid columns */}
        <header className={`${styles.header} ${isVisible ? styles.revealed : ''}`}>
          <div className={styles.headerContent}>
            <div className={styles.eyebrowRow}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              <span className={styles.eyebrow}>WHAT WE DO</span>
              <span className={styles.eyebrowLine} aria-hidden="true" />
            </div>

            <h2 className={styles.headline}>
              Three pillars of <em className={styles.headlineItalic}>purpose &amp; action</em>
            </h2>

            <p className={styles.subline}>
              Creating safer spaces through awareness, learning and care.
            </p>
          </div>
        </header>

        {/* Chapters List: Master Grid with consistent 4-column structure */}
        <div className={styles.chaptersList} role="region" aria-label="Action Chapters">
          {CHAPTERS.map((chapter, index) => {
            const isActive = activeChapter === index;
            const isPassed = activeChapter > index;

            return (
              <article
                key={chapter.id}
                ref={(el) => (chapterRefs.current[index] = el)}
                data-chapter-index={index}
                className={`${styles.chapterRow} ${
                  isActive ? styles.chapterActive : styles.chapterInactive
                } ${isVisible ? styles.chapterRevealed : ''}`}
                style={{
                  transitionDelay: isVisible ? `${index * 120 + 80}ms` : '0ms',
                }}
                onClick={() => handleChapterClick(index)}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                aria-label={`Chapter ${chapter.number}: ${chapter.title}. ${chapter.statement}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleChapterClick(index);
                  }
                }}
              >
                {/* Active Gold Glow Border Overlay */}
                <div
                  className={`${styles.rowGlow} ${isActive ? styles.rowGlowActive : ''}`}
                  aria-hidden="true"
                />

                {/* Column 1: Progress Rail */}
                <div className={styles.railCol} aria-hidden="true">
                  <div
                    className={`${styles.railSegment} ${
                      index === 0 ? styles.railSegmentHidden : ''
                    } ${isPassed || isActive ? styles.railSegmentActive : ''}`}
                  />
                  <div
                    className={`${styles.railNode} ${
                      isActive
                        ? styles.railNodeActive
                        : isPassed
                        ? styles.railNodePassed
                        : ''
                    }`}
                  />
                  <div
                    className={`${styles.railSegment} ${
                      index === CHAPTERS.length - 1 ? styles.railSegmentHidden : ''
                    } ${isPassed ? styles.railSegmentActive : ''}`}
                  />
                </div>

                {/* Column 2: Chapter Number */}
                <div className={styles.numberCol}>
                  <span className={styles.number}>{chapter.number}</span>
                </div>

                {/* Column 3: Main Editorial Content */}
                <div className={styles.contentCol}>
                  <div className={styles.conceptRow}>
                    <span className={styles.conceptTag}>{chapter.concept}</span>
                  </div>

                  <h3 className={styles.statement}>{chapter.statement}</h3>

                  <p className={styles.description}>{chapter.description}</p>
                </div>

                {/* Column 4: Metadata & CTA */}
                <div className={styles.metaCol}>
                  <span className={styles.categoryLabel}>{chapter.title}</span>

                  <button
                    type="button"
                    className={styles.actionBtn}
                    onClick={(e) => handleNavigate(chapter, e)}
                    aria-label={`${chapter.actionLabel} for ${chapter.title}`}
                  >
                    <span className={styles.actionText}>{chapter.actionLabel}</span>
                    <span className={styles.arrowWrap} aria-hidden="true">
                      <ArrowRight size={15} className={styles.arrowIcon} />
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
          {/* Closing Hairline Divider */}
          <div className={styles.closingDivider} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
