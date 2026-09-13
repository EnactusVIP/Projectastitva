import React from 'react';
import { Check } from 'lucide-react';
import styles from './SuccessState.module.css';

export default function SuccessState({ onClose }) {
  return (
    <div className={styles.successContainer} role="status" aria-live="polite">
      <div className={styles.checkCircle} aria-hidden="true">
        <Check className={styles.checkIcon} />
      </div>

      <span className={styles.eyebrow}>YOU'RE IN</span>

      <h3 className={styles.title}>Welcome to the Astitva community</h3>

      <p className={styles.message}>
        Thank you for connecting with us. We are honored to welcome you into this safe, empathetic space.
      </p>

      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        autoFocus
      >
        Close
      </button>
    </div>
  );
}
