import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import SaathiChatModal from './SaathiChatModal';
import styles from './SaathiFloatingLauncher.module.css';

const LINE_1 = "Namaste. I'm Saathi.";
const LINE_2 = "I'm here to listen.";
const LINE_3 = "What's on your mind?";

export default function SaathiFloatingLauncher() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTeaserVisible, setIsTeaserVisible] = useState(false);

  // Typing animation states
  const [text1, setText1] = useState('');
  const [showDots, setShowDots] = useState(false);
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');
  const [activeLine, setActiveLine] = useState(1); // 1, 'dots', 2, 3, 'done'

  const autoCollapseTimerRef = useRef(null);

  // Initial auto-reveal after ~2 seconds
  useEffect(() => {
    // Check if user already dismissed or interacted in this session
    const isDismissed = sessionStorage.getItem('saathi_teaser_dismissed') === '1';

    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsTeaserVisible(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Character-by-character typing animation engine
  useEffect(() => {
    if (!isTeaserVisible) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) {
      setText1(LINE_1);
      setText2(LINE_2);
      setText3(LINE_3);
      setActiveLine('done');
      return;
    }

    let charIdx = 0;
    let typingInterval = null;
    let stepTimer = null;

    // Step 1: Type Line 1
    if (activeLine === 1) {
      typingInterval = setInterval(() => {
        charIdx += 1;
        setText1(LINE_1.slice(0, charIdx));
        if (charIdx >= LINE_1.length) {
          clearInterval(typingInterval);
          stepTimer = setTimeout(() => {
            setActiveLine('dots');
          }, 600);
        }
      }, 45);
    }

    // Step 2: Show Dots
    else if (activeLine === 'dots') {
      setShowDots(true);
      stepTimer = setTimeout(() => {
        setShowDots(false);
        setActiveLine(2);
      }, 900);
    }

    // Step 3: Type Line 2
    else if (activeLine === 2) {
      charIdx = 0;
      typingInterval = setInterval(() => {
        charIdx += 1;
        setText2(LINE_2.slice(0, charIdx));
        if (charIdx >= LINE_2.length) {
          clearInterval(typingInterval);
          stepTimer = setTimeout(() => {
            setActiveLine(3);
          }, 500);
        }
      }, 42);
    }

    // Step 4: Type Line 3
    else if (activeLine === 3) {
      charIdx = 0;
      typingInterval = setInterval(() => {
        charIdx += 1;
        setText3(LINE_3.slice(0, charIdx));
        if (charIdx >= LINE_3.length) {
          clearInterval(typingInterval);
          setActiveLine('done');

          // Step 5: Auto-collapse after ~7s of stillness
          autoCollapseTimerRef.current = setTimeout(() => {
            setIsTeaserVisible(false);
          }, 7000);
        }
      }, 45);
    }

    return () => {
      if (typingInterval) clearInterval(typingInterval);
      if (stepTimer) clearTimeout(stepTimer);
    };
  }, [isTeaserVisible, activeLine]);

  // Cleanup auto-collapse timer
  useEffect(() => {
    return () => {
      if (autoCollapseTimerRef.current) {
        clearTimeout(autoCollapseTimerRef.current);
      }
    };
  }, []);

  const handleOpenChat = () => {
    if (autoCollapseTimerRef.current) {
      clearTimeout(autoCollapseTimerRef.current);
    }
    setIsTeaserVisible(false);
    setIsChatOpen(true);
    sessionStorage.setItem('saathi_teaser_dismissed', '1');
  };

  const handleDismissTeaser = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (autoCollapseTimerRef.current) {
      clearTimeout(autoCollapseTimerRef.current);
    }
    setIsTeaserVisible(false);
    sessionStorage.setItem('saathi_teaser_dismissed', '1');
  };

  const handleOrbClick = () => {
    if (isTeaserVisible) {
      // Direct action when teaser is active: open chat
      handleOpenChat();
    } else {
      // Re-trigger teaser or directly open chat
      setIsTeaserVisible(true);
      // If already finished typing before, reset to full text
      if (text3 === LINE_3) {
        setActiveLine('done');
      }
    }
  };

  return (
    <>
      <div className={styles.floatingContainer} role="region" aria-label="Saathi AI Assistant Launcher">
        {/* Floating Mini Teaser Popup */}
        {isTeaserVisible && (
          <>
            <div
              className={styles.teaserCard}
              onClick={handleOpenChat}
              role="dialog"
              aria-modal="false"
              aria-label="Saathi AI preview. Click to open full confidential conversation."
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenChat();
                } else if (e.key === 'Escape') {
                  handleDismissTeaser(e);
                }
              }}
            >
              {/* Header */}
              <div className={styles.teaserHeader}>
                <div className={styles.teaserIdentity}>
                  <span className={styles.sparkleGlyph} aria-hidden="true">✦</span>
                  <span className={styles.teaserTitle}>SAATHI // AI COMPANION</span>
                </div>

                <div className={styles.teaserStatus} aria-hidden="true">
                  <span className={styles.statusDot} />
                  <span className={styles.statusLabel}>LISTENING</span>
                </div>

                <button
                  type="button"
                  className={styles.teaserCloseBtn}
                  onClick={handleDismissTeaser}
                  aria-label="Dismiss Saathi teaser"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Message Typing Body */}
              <div className={styles.teaserBody}>
                {text1 && (
                  <p className={styles.messageLine}>
                    {text1}
                    {activeLine === 1 && <span className={styles.cursor} aria-hidden="true" />}
                  </p>
                )}

                {showDots && (
                  <div className={styles.dotsIndicator} aria-hidden="true">
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                  </div>
                )}

                {text2 && (
                  <p className={styles.messageLine}>
                    {text2}
                    {activeLine === 2 && <span className={styles.cursor} aria-hidden="true" />}
                  </p>
                )}

                {text3 && (
                  <p className={`${styles.messageLine} ${styles.highlight}`}>
                    {text3}
                    {activeLine === 3 && <span className={styles.cursor} aria-hidden="true" />}
                  </p>
                )}
              </div>

              {/* Footer CTA */}
              <div className={styles.teaserFooter}>
                <span className={styles.teaserCta}>
                  <span>TALK TO SAATHI</span>
                  <span className={styles.teaserCtaArrow} aria-hidden="true">→</span>
                  <span className={styles.teaserCtaLine} aria-hidden="true" />
                </span>
              </div>
            </div>

            {/* Glowing Connector Line */}
            <div className={styles.connectorLine} aria-hidden="true" />
          </>
        )}

        {/* Small Futuristic Launcher Orb */}
        <button
          type="button"
          className={styles.launcherOrb}
          onClick={handleOrbClick}
          aria-label={isTeaserVisible ? "Open Saathi AI Chat" : "Talk with Saathi AI Companion"}
          aria-haspopup="dialog"
        >
          <div className={styles.orbCore} aria-hidden="true" />
          <span className={styles.orbLabel}>SAATHI</span>
        </button>
      </div>

      {/* Existing Live Gemini Chatbot Modal */}
      <SaathiChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
}
