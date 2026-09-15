import { useState, useEffect, useRef } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { sendMessageToSaathi } from '../services/saathiService';
import styles from './SaathiChatModal.module.css';

const STARTER_PROMPTS = [
  'I need someone to talk to about my feelings.',
  'Can you connect me to LGBTQ+ friendly resources?',
  'How can I access mental wellness support?',
];

export default function SaathiChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message or indicator
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, error, isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const content = (textToSend || input).trim();
    if (!content || isLoading) return;

    setError(null);
    setInput('');

    const newHistory = [...messages, { role: 'user', content }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const reply = await sendMessageToSaathi(newHistory);
      setMessages([...newHistory, { role: 'assistant', content: reply }]);
    } catch (err) {
      const fallbackMsg =
        err.message || 'Saathi is having trouble responding right now. Please try again in a moment.';
      setError(fallbackMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (messages.length === 0 || isLoading) return;
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMessage) return;

    setError(null);
    setIsLoading(true);

    sendMessageToSaathi(messages)
      .then((reply) => {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      })
      .catch((err) => {
        setError(err.message || 'Saathi is having trouble responding right now. Please try again in a moment.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleResetChat = () => {
    setMessages([]);
    setError(null);
    setInput('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleKeyDownInput = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="saathi-modal-title"
      onClick={onClose}
    >
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleRow}>
            <div className={styles.saathiAvatarCircle} aria-hidden="true">
              <Sparkles size={18} className={styles.accentIcon} />
            </div>
            <div className={styles.titleGroup}>
              <h3 id="saathi-modal-title" className={styles.modalTitle}>
                Saathi: AI Companion
              </h3>
              <span className={styles.modalBadge}>CONFIDENTIAL COMPANION</span>
            </div>
          </div>

          <div className={styles.headerActions}>
            {messages.length > 0 && (
              <button
                type="button"
                className={styles.resetBtn}
                onClick={handleResetChat}
                title="Start a fresh conversation"
              >
                New Chat
              </button>
            )}
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={onClose}
              aria-label="Close Saathi modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Conversation Body */}
        <div className={styles.modalBody} tabIndex={0} aria-label="Conversation with Saathi">
          {/* Welcome Greeting (Always visible as foundation) */}
          <p className={styles.modalWelcome}>
            &ldquo;Namaste. I am Saathi. I am here to listen without judgment, offer helpful resources, and walk beside you in your journey.&rdquo;
          </p>

          {/* Starter Prompts (Shown only at start of conversation) */}
          {messages.length === 0 && (
            <div className={styles.starterPromptList}>
              <span className={styles.promptHeader}>STARTER CONVERSATIONS:</span>
              {STARTER_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={styles.promptItem}
                  disabled={isLoading}
                  onClick={() => handleSend(prompt)}
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          )}

          {/* Messages Stream */}
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`${styles.messageWrapper} ${
                  isUser ? styles.userMessageWrapper : styles.saathiMessageWrapper
                }`}
              >
                <span className={styles.messageSenderLabel}>
                  {isUser ? 'You' : 'Saathi'}
                </span>
                <div className={isUser ? styles.userBubble : styles.saathiBubble}>
                  {msg.content}
                </div>
              </div>
            );
          })}

          {/* Subtle Typing Indicator */}
          {isLoading && (
            <div className={`${styles.messageWrapper} ${styles.saathiMessageWrapper}`} aria-live="polite">
              <span className={styles.messageSenderLabel}>Saathi</span>
              <div className={styles.loadingBubble}>
                <span className={styles.loadingText}>Saathi is thinking</span>
                <span className={styles.dotsRow} aria-hidden="true">
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </span>
              </div>
            </div>
          )}

          {/* Error Message & Retry */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <p className={styles.errorText}>{error}</p>
              <button type="button" className={styles.retryBtn} onClick={handleRetry}>
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* Input Bar */}
        <form
          className={styles.inputForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <textarea
            ref={inputRef}
            rows={1}
            className={styles.inputField}
            placeholder="Type your message to Saathi..."
            aria-label="Type your message to Saathi"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDownInput}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer Disclaimer */}
        <div className={styles.modalFooter}>
          <span className={styles.modalDisclaimer}>
            Note: Saathi provides empathetic conversation and guidance, not emergency clinical care.
          </span>
        </div>
      </div>
    </div>
  );
}
