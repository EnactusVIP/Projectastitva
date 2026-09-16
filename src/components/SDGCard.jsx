import { RotateCw } from 'lucide-react';
import styles from './SDGCard.module.css';

export default function SDGCard({
  number,
  title,
  headline,
  description,
  image,
  accentColor,
  isFlipped,
  onFlip,
  isVisible,
  delay = 0,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onFlip();
    }
  };

  const formattedNumber = String(number).padStart(2, '0');

  return (
    <div
      className={`${styles.cardWrapper} ${isVisible ? styles.visible : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`${styles.cardInner} ${isFlipped ? styles.flipped : ''}`}
        onClick={onFlip}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        aria-label={`SDG ${number}: ${title}. ${
          isFlipped ? 'Details shown. Tap to flip back to image.' : 'Tap to flip and explore description.'
        }`}
        style={{ '--card-accent': accentColor }}
      >
        {/* FRONT FACE: Official SDG Artwork */}
        <div className={styles.cardFaceFront}>
          <img
            src={image}
            alt={`SDG ${number}: ${title}`}
            className={styles.cardImage}
            loading="lazy"
          />
          <div className={styles.frontOverlay}>
            <span className={styles.exploreHint}>
              <span>Tap to explore</span>
              <RotateCw size={12} className={styles.exploreIcon} aria-hidden="true" />
            </span>
          </div>
        </div>

        {/* BACK FACE: Clean Editorial Info */}
        <div className={styles.cardFaceBack}>
          <div className={styles.backAccentBar} aria-hidden="true" />

          <div className={styles.backTopRow}>
            {String(number) !== '5' && (
              <span className={styles.backNumber} aria-hidden="true">
                {formattedNumber}
              </span>
            )}
            <span className={styles.backBadge} style={{ color: accentColor }}>
              SDG {formattedNumber}
            </span>
          </div>

          <div className={styles.backContent}>
            <h3 className={styles.backTitle}>{title}</h3>
            {headline && <p className={styles.backHeadline}>{headline}</p>}
            {description && <p className={styles.backDescription}>{description}</p>}
          </div>

          <div className={styles.backFooter}>
            <span className={styles.flipBackHint}>
              <RotateCw size={12} aria-hidden="true" />
              <span>Tap to flip back</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
