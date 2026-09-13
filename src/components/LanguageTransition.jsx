import { useEffect, useState, useRef, useCallback } from 'react';
import styles from './LanguageTransition.module.css';

/**
 * Carefully selected sequence of Indian & regional scripts:
 * English -> Hindi -> Bengali -> Tamil -> Telugu -> Gujarati -> Hindi -> English (resolve)
 */
export const LANGUAGE_SEQUENCE = [
  {
    id: 'en-start',
    text: 'ASTITVA',
    language: 'English',
    fontFamily: 'var(--font-heading, "Playfair Display", serif)',
    letterSpacing: '0.24em',
    fontWeight: '400',
    fontStyle: 'italic',
    lineLength: 130,
  },
  {
    id: 'hi-start',
    text: 'अस्तित्व',
    language: 'Hindi',
    fontFamily: 'var(--font-hindi, "Noto Sans Devanagari", sans-serif)',
    letterSpacing: '0.04em',
    fontWeight: '500',
    fontStyle: 'normal',
    lineLength: 150,
  },
  {
    id: 'bn',
    text: 'অস্তিত্ব',
    language: 'Bengali',
    fontFamily: 'var(--font-bengali, "Noto Sans Bengali", sans-serif)',
    letterSpacing: '0.05em',
    fontWeight: '500',
    fontStyle: 'normal',
    lineLength: 145,
  },
  {
    id: 'ta',
    text: 'அஸ்தித்வா',
    language: 'Tamil',
    fontFamily: 'var(--font-tamil, "Noto Sans Tamil", sans-serif)',
    letterSpacing: '0.06em',
    fontWeight: '500',
    fontStyle: 'normal',
    lineLength: 170,
  },
  {
    id: 'te',
    text: 'అస్తిత్వం',
    language: 'Telugu',
    fontFamily: 'var(--font-telugu, "Noto Sans Telugu", sans-serif)',
    letterSpacing: '0.05em',
    fontWeight: '500',
    fontStyle: 'normal',
    lineLength: 155,
  },
  {
    id: 'gu',
    text: 'અસ્તિત્વ',
    language: 'Gujarati',
    fontFamily: 'var(--font-gujarati, "Noto Sans Gujarati", sans-serif)',
    letterSpacing: '0.05em',
    fontWeight: '500',
    fontStyle: 'normal',
    lineLength: 145,
  },
  {
    id: 'hi-return',
    text: 'अस्तित्व',
    language: 'Hindi',
    fontFamily: 'var(--font-hindi, "Noto Sans Devanagari", sans-serif)',
    letterSpacing: '0.04em',
    fontWeight: '500',
    fontStyle: 'normal',
    lineLength: 150,
  },
  {
    id: 'en-final',
    text: 'ASTITVA',
    language: 'English',
    fontFamily: 'var(--font-heading, "Playfair Display", serif)',
    letterSpacing: '0.22em',
    fontWeight: '400',
    fontStyle: 'italic',
    lineLength: 130,
    isFinal: true,
  },
];

export default function LanguageTransition({ onComplete, languages = LANGUAGE_SEQUENCE }) {
  // Double-buffered layer system to guarantee zero-flicker organic morphing
  const [layerA, setLayerA] = useState({
    data: languages[0],
    active: true,
  });
  const [layerB, setLayerB] = useState({
    data: languages[1] || languages[0],
    active: false,
  });

  // Current active slot: 'A' or 'B'
  const [activeSlot, setActiveSlot] = useState('A');
  const [stepIndex, setStepIndex] = useState(0);

  const [isResolving, setIsResolving] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const timerRef = useRef(null);

  const currentItem = languages[stepIndex] || languages[0];

  const handleFinish = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRevealing(true);
    setTimeout(() => {
      setIsDismissed(true);
      if (onComplete) onComplete();
    }, 650);
  }, [onComplete]);

  // Handle escape to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  // Main Progression Engine
  useEffect(() => {
    if (isDismissed) return;

    const isLastStep = stepIndex >= languages.length - 1;

    if (isLastStep) {
      // Final resolve state
      setIsResolving(true);
      timerRef.current = setTimeout(() => {
        setIsRevealing(true);
        setTimeout(() => {
          setIsDismissed(true);
          if (onComplete) onComplete();
        }, 650);
      }, 950);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    // Hold step, then advance to next language using double buffer
    const holdDuration = 480; // Hold time where word is stationary and crisp

    timerRef.current = setTimeout(() => {
      const nextIndex = stepIndex + 1;
      const nextLang = languages[nextIndex];

      if (activeSlot === 'A') {
        // Transition A -> B
        setLayerB({ data: nextLang, active: true });
        setLayerA((prev) => ({ ...prev, active: false }));
        setActiveSlot('B');
      } else {
        // Transition B -> A
        setLayerA({ data: nextLang, active: true });
        setLayerB((prev) => ({ ...prev, active: false }));
        setActiveSlot('A');
      }

      setStepIndex(nextIndex);
    }, holdDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stepIndex, activeSlot, languages, isDismissed, handleFinish, onComplete]);

  if (isDismissed) return null;

  return (
    <div
      className={`${styles.container} ${isRevealing ? styles.revealing : ''}`}
      aria-label="Project Astitva multilingual introduction"
    >
      {/* Ambient background golden undertone */}
      <div className={styles.ambientGlow} aria-hidden="true" />


      {/* Center Stage */}
      <div className={styles.centerStage}>
        <div
          className={`${styles.wordWrapper} ${
            isResolving ? styles.resolving : ''
          }`}
        >
          {/* Layer A */}
          <span
            className={`${styles.word} ${
              layerA.active ? styles.wordActive : styles.wordInactive
            }`}
            style={{
              fontFamily: layerA.data.fontFamily,
              letterSpacing: layerA.data.letterSpacing,
              fontWeight: layerA.data.fontWeight,
              fontStyle: layerA.data.fontStyle,
            }}
          >
            {layerA.data.text}
          </span>

          {/* Layer B */}
          <span
            className={`${styles.word} ${
              layerB.active ? styles.wordActive : styles.wordInactive
            }`}
            style={{
              fontFamily: layerB.data.fontFamily,
              letterSpacing: layerB.data.letterSpacing,
              fontWeight: layerB.data.fontWeight,
              fontStyle: layerB.data.fontStyle,
            }}
          >
            {layerB.data.text}
          </span>
        </div>

        {/* The Connection Line & Community Ring */}
        <div
          className={`${styles.connectionStage} ${
            isResolving ? styles.ringActive : ''
          }`}
        >
          <svg
            className={styles.connectionSvg}
            viewBox="0 0 280 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#facc15" stopOpacity="0" />
                <stop offset="35%" stopColor="#facc15" stopOpacity="0.85" />
                <stop offset="65%" stopColor="#fbbf24" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#facc15" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#eab308" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.6" />
              </linearGradient>
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Traveling Connection Horizon Line */}
            <line
              x1={140 - (currentItem.lineLength || 140) / 2}
              y1="24"
              x2={140 + (currentItem.lineLength || 140) / 2}
              y2="24"
              stroke="url(#goldGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              className={styles.animatedLine}
            />

            {/* Gliding Ember / Pulse */}
            <circle
              cx="140"
              cy="24"
              r="2"
              fill="#ffffff"
              filter="url(#softGlow)"
              className={styles.lineEmber}
            />

            {/* Community Ring of Belonging: forms on final resolve */}
            <ellipse
              cx="140"
              cy="24"
              rx="44"
              ry="18"
              stroke="url(#ringGradient)"
              strokeWidth="1.5"
              fill="none"
              className={styles.communityRing}
            />
          </svg>
        </div>

        {/* Subtle Language / Meaning Indicator */}
        <div className={styles.subtextWrapper}>
          <span className={styles.languageLabel}>
            {isResolving ? 'exist as you are.' : currentItem.language}
          </span>
        </div>
      </div>
    </div>
  );
}
