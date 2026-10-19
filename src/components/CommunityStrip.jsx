import communityStripImg from '../assets/community-strip.png';
import styles from './CommunityStrip.module.css';

export default function CommunityStrip({ show = true, className = '', editorial = false }) {
  if (!show) return null;
  return (
    <div className={`${styles.communityStrip} ${editorial ? styles.editorialStrip : ''} ${className}`.trim()}>
      <img src={communityStripImg} width="1821" height="362"
        alt="Diverse people standing together, representing community, inclusion and belonging"
        className={styles.stripImage} loading="lazy" />
    </div>
  );
}
