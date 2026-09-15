import { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import SaathiChatModal from './SaathiChatModal';
import styles from './SaathiSection.module.css';

export default function SaathiSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animStage, setAnimStage] = useState(0);
  const sectionRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) {
      setAnimStage(4); // Immediately show all messages
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setAnimStage(4);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;

          // Single-run gentle animation sequence (~3.5s total)
          const t1 = setTimeout(() => setAnimStage(1), 300);  // Msg 1
          const t2 = setTimeout(() => setAnimStage(2), 1100); // Msg 2
          const t3 = setTimeout(() => setAnimStage(3), 1900); // Typing indicator
          const t4 = setTimeout(() => setAnimStage(4), 2800); // Msg 3

          return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
          };
        }
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className={styles.saathiSection}
        aria-label="Meet Saathi — AI Companion"
      >
        <div className={styles.ambientGlow} aria-hidden="true" />

        <div className={styles.container}>
          <div className={styles.editorialGrid}>
            {/* Left Column: Editorial Statement & Invitation */}
            <div className={styles.contentColumn}>
              <div className={styles.eyebrowRow}>
                <span className={styles.eyebrow}>MEET SAATHI</span>
                <span className={styles.eyebrowLine} aria-hidden="true" />
              </div>

              <h2 className={styles.heading}>
                <span className={styles.headingLine}>You don&apos;t always need</span>
                <span className={styles.headingLine}>an answer.</span>
                <span className={styles.headingLine}>
                  Sometimes, you just need
                </span>
                <span className={`${styles.headingLine} ${styles.headingItalic}`}>
                  someone to listen.
                </span>
              </h2>

              <p className={styles.supportingText}>
                A private space to talk, reflect, explore your feelings, or simply be heard.
              </p>

              <button
                type="button"
                className={styles.ctaButton}
                onClick={() => setIsModalOpen(true)}
                aria-label="Start a conversation with Saathi"
              >
                <span>START A CONVERSATION</span>
                <ArrowRight size={16} className={styles.ctaArrow} aria-hidden="true" />
                <span className={styles.ctaUnderline} aria-hidden="true" />
              </button>
            </div>

            {/* Right Column: Conversational Canvas Preview */}
            <div className={styles.previewColumn}>
              <div
                className={styles.canvasCard}
                onClick={() => setIsModalOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsModalOpen(true);
                  }
                }}
                aria-label="Preview conversation with Saathi. Click to start a live chat."
              >
                {/* Preview Header */}
                <div className={styles.canvasHeader}>
                  <div className={styles.identityRow}>
                    <div className={styles.avatarCircle} aria-hidden="true">
                      <Sparkles size={16} className={styles.sparkleIcon} />
                    </div>
                    <div className={styles.identityText}>
                      <span className={styles.saathiName}>Saathi</span>
                      <span className={styles.saathiRole}>AI COMPANION</span>
                    </div>
                  </div>

                  <div className={styles.statusIndicator} aria-hidden="true">
                    <span className={styles.statusDot} />
                    <span className={styles.statusText}>Listening space</span>
                  </div>
                </div>

                {/* Preview Conversation Body */}
                <div className={styles.canvasBody}>
                  {/* Message 1 */}
                  <div
                    className={`${styles.messageBubble} ${
                      animStage >= 1 ? styles.visible : ''
                    }`}
                  >
                    Namaste. I&apos;m Saathi.
                  </div>

                  {/* Message 2 */}
                  <div
                    className={`${styles.messageBubble} ${
                      animStage >= 2 ? styles.visible : ''
                    }`}
                  >
                    I&apos;m here to listen.
                  </div>

                  {/* Typing Indicator (shown between msg 2 and msg 3) */}
                  {animStage === 3 && (
                    <div className={styles.typingBubble} aria-hidden="true">
                      <span className={styles.typingDot} />
                      <span className={styles.typingDot} />
                      <span className={styles.typingDot} />
                    </div>
                  )}

                  {/* Message 3 */}
                  <div
                    className={`${styles.messageBubble} ${
                      animStage >= 4 ? styles.visible : ''
                    }`}
                  >
                    How are you feeling today?
                  </div>
                </div>

                {/* Preview Footer */}
                <div className={styles.canvasFooter}>
                  <span className={styles.canvasHint}>
                    <span>Click to begin speaking with Saathi</span>
                    <ArrowRight size={14} className={styles.canvasHintArrow} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Existing Saathi Chat Modal */}
      <SaathiChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
