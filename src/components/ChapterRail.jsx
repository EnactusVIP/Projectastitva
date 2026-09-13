import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './ChapterRail.module.css';

export const DEFAULT_CHAPTERS = [
  { id: 'idea', number: '01', label: 'IDEA' },
  { id: 'why', number: '02', label: 'WHY' },
  { id: 'human', number: '03', label: 'SUPPORT' },
  { id: 'ai', number: '04', label: 'AI' },
  { id: 'belief', number: '05', label: 'BELIEF' },
  { id: 'impact', number: '06', label: 'IMPACT' },
];

export default function ChapterRail({
  chapters = DEFAULT_CHAPTERS,
  activeChapter = 'idea',
  onSelectChapter,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeIndex = useMemo(() => {
    return chapters.findIndex((ch) => ch.id === activeChapter);
  }, [chapters, activeChapter]);

  // Compute progress percentage along the track (0% to 100%)
  const progressPercent = useMemo(() => {
    if (activeIndex < 0) return 0;
    if (chapters.length <= 1) return 100;
    return (activeIndex / (chapters.length - 1)) * 100;
  }, [activeIndex, chapters.length]);

  const activeChapterData = useMemo(() => {
    return chapters[activeIndex] || null;
  }, [chapters, activeIndex]);

  const handleChapterClick = (id) => {
    if (typeof onSelectChapter === 'function') {
      onSelectChapter(id);
    } else {
      if (id === 'hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      // Fallback direct smooth scroll
      const el = document.getElementById(`chapter-${id}`) || document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const railContent = (
    <div className={styles.chapterRailPortalWrapper}>
      {/* ===================================================================
          DESKTOP: Refined Right-Edge Chapter Rail (Fixed to Viewport)
          =================================================================== */}
      <nav
        className={styles.desktopRail}
        aria-label="Story Chapters Navigation"
      >
        <div className={styles.railInner}>
          {/* Subtle "TOP" jump button above Chapter 01 */}
          <button
            type="button"
            className={`${styles.topButton} ${
              activeIndex > 0 ? styles.topButtonVisible : ''
            }`}
            onClick={() => handleChapterClick('hero')}
            aria-label="Scroll to top of About Us page"
          >
            <span className={styles.topLabel}>TOP</span>
            <span className={styles.topArrowWrapper} aria-hidden="true">
              ↑
            </span>
          </button>

          {/* Subtle Vertical Track Line */}
          <div className={styles.trackBackground} aria-hidden="true">
            <div
              className={styles.trackProgress}
              style={{ height: `${progressPercent}%` }}
            />
          </div>

          {/* Chapter Items List */}
          <div className={styles.chapterList}>
            {chapters.map((ch, index) => {
              const isActive = ch.id === activeChapter;
              const isPassed = activeIndex >= 0 && index < activeIndex;

              return (
                <button
                  key={ch.id}
                  type="button"
                  className={`${styles.railItem} ${
                    isActive ? styles.railItemActive : ''
                  } ${isPassed ? styles.railItemPassed : ''}`}
                  onClick={() => handleChapterClick(ch.id)}
                  aria-label={`Scroll to chapter ${ch.number}: ${ch.label}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {/* Label on Left of Dot */}
                  <span className={styles.labelWrapper}>
                    <span className={styles.labelNumber}>{ch.number}</span>
                    <span className={styles.labelSlash}>/</span>
                    <span className={styles.labelText}>{ch.label}</span>
                  </span>

                  {/* Dot / Active Indicator on Right */}
                  <span className={styles.dotWrapper} aria-hidden="true">
                    <span className={styles.dot} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ===================================================================
          MOBILE: Sleek Docked Floating Progress Pill (max-width: 768px)
          =================================================================== */}
      <nav
        className={styles.mobileRail}
        aria-label="Mobile Story Chapters"
      >
        <div className={styles.mobilePill}>
          {/* Active Chapter Badge */}
          <div className={styles.mobileBadge}>
            <span className={styles.mobileBadgeNumber}>
              {activeChapterData ? activeChapterData.number : '01'}
            </span>
            <span className={styles.mobileBadgeSlash}>/</span>
            <span className={styles.mobileBadgeLabel}>
              {activeChapterData ? activeChapterData.label : 'IDEA'}
            </span>
          </div>

          <span className={styles.mobileDivider} aria-hidden="true" />

          {/* Step Sequence: 01 ─ 02 ─ 03 ─ 04 ─ 05 ─ 06 */}
          <div className={styles.mobileSteps}>
            {chapters.map((ch, index) => {
              const isActive = ch.id === activeChapter;
              const isPassed = activeIndex >= 0 && index < activeIndex;

              return (
                <React.Fragment key={ch.id}>
                  {index > 0 && (
                    <span
                      className={`${styles.mobileConnector} ${
                        index <= activeIndex ? styles.mobileConnectorActive : ''
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  <button
                    type="button"
                    className={`${styles.mobileStepButton} ${
                      isActive ? styles.mobileStepButtonActive : ''
                    } ${isPassed ? styles.mobileStepButtonPassed : ''}`}
                    onClick={() => handleChapterClick(ch.id)}
                    aria-label={`Chapter ${ch.number}: ${ch.label}`}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {ch.number}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* Micro Progress Bar along bottom edge */}
          <div className={styles.mobileProgressBar} aria-hidden="true">
            <div
              className={styles.mobileProgressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </nav>
    </div>
  );

  if (mounted && typeof document !== 'undefined') {
    return createPortal(railContent, document.body);
  }

  return railContent;
}
