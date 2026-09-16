import { useState } from 'react';
import sdg5Image from '../assets/E_WEB_05.jpg';
import styles from './SDG5Feature.module.css';

export default function SDG5Feature({ isVisible = true }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className={`${styles.featureContainer} ${isVisible ? styles.visible : ''} ${
        isHovered ? styles.activeState : ''
      }`}
      aria-labelledby="sdg5-heading"
    >
      {/* Visual Object Column: Official SDG 5 Artwork */}
      <div
        className={styles.cardColumn}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={styles.visualFrame}
          tabIndex={0}
          role="region"
          aria-label="Sustainable Development Goal 5: Gender Equality card presentation"
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
        >
          <div className={styles.imageWrapper}>
            <img
              src={sdg5Image}
              alt="United Nations Sustainable Development Goal 5: Gender Equality"
              className={styles.sdgImage}
              loading="lazy"
              width={280}
              height={280}
            />
          </div>

          {/* Editorial Caption below artwork */}
          <div className={styles.captionBar}>
            <span className={styles.captionTag}>SDG 05</span>
            <span className={styles.captionDot} aria-hidden="true">•</span>
            <span className={styles.captionTitle}>GENDER EQUALITY</span>
          </div>

          {/* Subtle Accent Line on Hover */}
          <div className={styles.cardAccentUnderline} aria-hidden="true" />
        </div>
      </div>

      {/* Dynamic Editorial Connector Line (Desktop) */}
      <div className={styles.connectorTrack} aria-hidden="true">
        <div className={styles.connectorLine} />
        <div className={styles.connectorDot} />
      </div>

      {/* Editorial Narrative Column */}
      <div className={styles.editorialColumn}>
        <div className={styles.eyebrowWrapper}>
          <span className={styles.eyebrow}>SDG 05 / GENDER EQUALITY</span>
        </div>

        <h3 id="sdg5-heading" className={styles.headline}>
          Equality begins with the freedom to exist as yourself.
        </h3>

        <p className={styles.bodyCopy}>
          Project Astitva works toward creating spaces where people can explore
          identity, seek support, and participate in community without fear of
          judgment or exclusion. Our focus on awareness, support, and inclusion
          connects with the broader goal of advancing gender equality and
          creating more equitable spaces for everyone.
        </p>

        <p className={styles.closingLine}>
          A more inclusive world begins by making space for every identity.
        </p>
      </div>
    </article>
  );
}
