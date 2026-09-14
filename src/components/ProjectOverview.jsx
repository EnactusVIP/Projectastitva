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
    // Lock scroll-observer override temporarily on click
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
      <div className={styles.container}>
        {/* Editorial Section Header */}
        <header className={`${styles.header} ${isVisible ? styles.revealed : ''}`}>
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
        </header>

        {/* Narrative Flow: Three Chapters of Action */}
        <div className={styles.chaptersWrapper}>
          {/* Subtle Connecting Thread Motif */}
          <div className={styles.connectingThread} aria-hidden="true">
            <div
              className={styles.threadProgress}
              style={{
                height: `${((activeChapter + 0.5) / CHAPTERS.length) * 100}%`,
              }}
            />
            {CHAPTERS.map((ch, idx) => (
              <div
                key={`node-${ch.id}`}
                className={`${styles.threadNode} ${
                  activeChapter === idx
                    ? styles.threadNodeActive
                    : activeChapter > idx
                    ? styles.threadNodePassed
                    : ''
                }`}
                style={{ top: `${((idx + 0.5) / CHAPTERS.length) * 100}%` }}
                title={`${ch.number} ${ch.concept}`}
              />
            ))}
          </div>

          {/* Chapters List */}
          <div className={styles.chaptersList} role="region" aria-label="Action Chapters">
            {CHAPTERS.map((chapter, index) => {
              const isActive = activeChapter === index;
              const chapterModClass =
                index === 0
                  ? styles.chapterAwareness
                  : index === 1
                  ? styles.chapterEducation
                  : styles.chapterSupport;

              return (
                <article
                  key={chapter.id}
                  ref={(el) => (chapterRefs.current[index] = el)}
                  data-chapter-index={index}
                  className={`${styles.chapterPanel} ${chapterModClass} ${
                    isActive ? styles.chapterActive : styles.chapterInactive
                  } ${isVisible ? styles.chapterRevealed : ''}`}
                  style={{
                    transitionDelay: isVisible ? `${index * 140 + 100}ms` : '0ms',
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
                  {/* Subtle Top Hairline Divider with Glow */}
                  <div className={styles.chapterDivider} aria-hidden="true">
                    <div
                      className={`${styles.dividerGlow} ${
                        isActive ? styles.dividerGlowActive : ''
                      }`}
                    />
                  </div>

                  <div className={styles.chapterContent}>
                    {/* Chapter Header Meta: Number + Concept Tag */}
                    <div className={styles.metaRow}>
                      <div className={styles.numberWrapper}>
                        <span className={styles.numberPrefix}>{chapter.number}</span>
                        <span className={styles.numberSlash}>/</span>
                        <span className={styles.conceptTag}>{chapter.concept}</span>
                      </div>

                      <div className={styles.titleBadge}>
                        <span className={styles.chapterTitle}>{chapter.title}</span>
                      </div>
                    </div>

                    {/* Large Editorial Statement */}
                    <h3 className={styles.statement}>
                      {chapter.statement}
                    </h3>

                    {/* Supporting Description & Sleek Interactive Action */}
                    <div className={styles.narrativeRow}>
                      <p className={styles.description}>{chapter.description}</p>

                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={(e) => handleNavigate(chapter, e)}
                        aria-label={`${chapter.actionLabel} for ${chapter.title}`}
                      >
                        <span className={styles.actionText}>{chapter.actionLabel}</span>
                        <span className={styles.arrowIconWrap} aria-hidden="true">
                          <ArrowRight size={16} className={styles.arrowIcon} />
                        </span>
                      </button>
                    </div>

                    {/* Active Accent Baseline */}
                    <div className={styles.activeAccentBar} aria-hidden="true" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
