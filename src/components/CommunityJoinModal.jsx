import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import CommunityJoinForm from './CommunityJoinForm';
import SuccessState from './SuccessState';
import styles from './CommunityJoinModal.module.css';

export default function CommunityJoinModal({ isOpen, onClose, triggerRef }) {
  const [mounted, setMounted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset success state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
    }
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle ESC key and focus restoration
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the trigger element when modal closes
      if (triggerRef && triggerRef.current) {
        triggerRef.current.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!mounted || !isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={styles.modalDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="community-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close community signup modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {isSuccess ? (
          <SuccessState onClose={onClose} />
        ) : (
          <CommunityJoinForm onSuccess={() => setIsSuccess(true)} />
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
