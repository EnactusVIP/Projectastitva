import { useTheme } from '../context/ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle({ className = '', variant = 'desktop' }) {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`${styles.toggleBtn} ${variant === 'mobile' ? styles.mobileVariant : styles.desktopVariant} ${className}`}
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className={styles.capsuleTrack}>
        {/* Sliding active pill indicator */}
        <span
          className={`${styles.activeIndicator} ${isDark ? styles.indicatorDark : styles.indicatorLight}`}
          aria-hidden="true"
        />

        {/* Light Option */}
        <span
          className={`${styles.option} ${!isDark ? styles.optionActive : ''}`}
          aria-hidden="true"
        >
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
          <span className={styles.optionLabel}>LIGHT</span>
        </span>

        {/* Dark Option */}
        <span
          className={`${styles.option} ${isDark ? styles.optionActive : ''}`}
          aria-hidden="true"
        >
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <span className={styles.optionLabel}>DARK</span>
        </span>
      </span>
    </button>
  );
}
