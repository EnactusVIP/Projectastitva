import { useEffect, useRef, useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Instagram,
  Linkedin,
  Send,
  MessageCircle,
} from 'lucide-react';
import styles from './Contact.module.css';

const SAATHI_RESPONSES = {
  feelings: {
    text: "I hear you deeply. Whatever feelings you are holding right now — whether confusion, sadness, relief, or exhaustion — they are completely valid. You do not have to carry everything alone. Our trained empathetic listeners can speak with you 1-on-1 on WhatsApp or Google Meet whenever you feel ready.",
    action: { label: 'Connect on WhatsApp', href: 'https://wa.me/917982104063?text=Hello%20Project%20Astitva,%20I%20would%20like%20to%20talk%20to%20a%20support%20listener.' },
  },
  resources: {
    text: "Project Astitva curates verified queer-affirmative health practitioners, legal aid under the Transgender Persons Act, and community support groups across India. You can explore our published toolkits in our Newsletter section, or write directly to us for a custom directory.",
    action: { label: 'Explore Resources & Newsletter', href: '#newsletter' },
  },
  wellness: {
    text: "Accessing mental wellness care should be compassionate and dignified. We offer free confidential listening sessions, regular art therapy circles, and anonymous expression spaces. How would you like to begin?",
    action: { label: 'Explore Support Pathways', href: '#support' },
  },
  fallback: {
    text: "Thank you for trusting me with that. I am holding space for your words. While our full AI companion model is in continuous development alongside queer mental health professionals, our human care team is ready to listen right now.",
    action: { label: 'Email Care Team', href: 'mailto:project.astitv@gmail.com?subject=Reaching%20out%20via%20Saathi' },
  },
};

export default function Contact({ onNavigate }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSaathiModal, setShowSaathiModal] = useState(false);

  // Saathi in-modal chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'init',
      sender: 'saathi',
      text: 'Namaste. I am Saathi — your confidential digital sanctuary companion. I am here to listen without judgment, share affirmative resources, and walk beside you. What is on your mind today?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatBottomRef = useRef(null);

  const [reveals, setReveals] = useState({
    hero: false,
    split: false,
    saathi: false,
    form: false,
  });

  const heroRef = useRef(null);
  const splitRef = useRef(null);
  const saathiRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle modal escape key and scroll lock
  useEffect(() => {
    if (!showSaathiModal) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowSaathiModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSaathiModal]);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    if (showSaathiModal && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isThinking, showSaathiModal]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setReveals({ hero: true, split: true, saathi: true, form: true });
      return;
    }

    const observers = [];
    const observe = (ref, key) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setReveals((prev) => ({ ...prev, [key]: true }));
          }
        },
        { threshold: 0.1, rootMargin: '-5% 0px -10% 0px' }
      );
      obs.observe(ref.current);
      observers.push({ obs, target: ref.current });
    };

    observe(heroRef, 'hero');
    observe(splitRef, 'split');
    observe(saathiRef, 'saathi');
    observe(formRef, 'form');

    return () => {
      observers.forEach(({ obs, target }) => {
        if (target) obs.unobserve(target);
      });
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    }, 600);
  };

  const handlePromptClick = (type) => {
    const prompts = {
      feelings: 'I need someone to talk to about my feelings.',
      resources: 'Can you connect me to LGBTQ+ friendly resources?',
      wellness: 'How can I access mental wellness support?',
    };

    const userText = prompts[type];
    if (!userText) return;

    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text: userText };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const res = SAATHI_RESPONSES[type];
      setChatMessages((prev) => [
        ...prev,
        {
          id: `saathi-${Date.now()}`,
          sender: 'saathi',
          text: res.text,
          action: res.action,
        },
      ]);
    }, 550);
  };

  const handleSendCustomChat = (e) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const res = SAATHI_RESPONSES.fallback;
      setChatMessages((prev) => [
        ...prev,
        {
          id: `saathi-${Date.now()}`,
          sender: 'saathi',
          text: res.text,
          action: res.action,
        },
      ]);
    }, 600);
  };

  return (
    <div className={styles.pageContainer}>
      <main>
        {/* ----------------------------------------------------------------
            1. CONTACT HERO
            ---------------------------------------------------------------- */}
        <section ref={heroRef} className={styles.heroSection} aria-label="Contact Us">
          <div className={styles.heroInner}>
            <div className={`${styles.revealElement} ${reveals.hero ? styles.revealed : ''} ${styles.heroEyebrowRow}`}>
              <span className={styles.heroEyebrow}>CONTACT US</span>
              <span className={styles.heroEyebrowLine} aria-hidden="true" />
            </div>

            <h1 className={`${styles.revealElement} ${reveals.hero ? styles.revealed : ''} ${styles.delay100} ${styles.heroTitle}`}>
              <span className={styles.titleLine}>Have a question?</span>
              <span className={styles.titleLineItalic}>We&apos;re here to listen.</span>
            </h1>

            <p className={`${styles.revealElement} ${reveals.hero ? styles.revealed : ''} ${styles.delay200} ${styles.heroSubtitle}`}>
              Whether you want to know more about Astitva, our support services, or simply reach out, you can talk to us.
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            2. EDITORIAL SPLIT: Statement (Left) + Contact Details (Right)
            ---------------------------------------------------------------- */}
        <section ref={splitRef} className={styles.splitSection} aria-label="Direct Contact Channels">
          <div className={styles.splitInner}>
            {/* Left Column: Editorial Statement */}
            <div className={`${styles.revealElement} ${reveals.split ? styles.revealed : ''} ${styles.splitLeft}`}>
              <span className={styles.sectionEyebrow}>GET IN TOUCH</span>
              <h2 className={styles.statementHeading}>
                Every conversation begins with an{' '}
                <em className={styles.accentItalic}>open door.</em>
              </h2>
              <p className={styles.statementText}>
                Reach out through whichever channel feels safest and most comfortable for you.
                Every inquiry is treated with confidentiality, empathy, and respect.
              </p>
            </div>

            {/* Subtle Vertical Divider */}
            <div className={styles.splitDivider} aria-hidden="true" />

            {/* Right Column: Contact Information */}
            <div className={`${styles.revealElement} ${reveals.split ? styles.revealed : ''} ${styles.delay100} ${styles.splitRight}`}>
              {/* Email */}
              <div className={styles.contactItem}>
                <div className={styles.iconCircle}>
                  <Mail size={18} className={styles.icon} aria-hidden="true" />
                </div>
                <div className={styles.contactText}>
                  <span className={styles.contactLabel}>EMAIL</span>
                  <a href="mailto:project.astitv@gmail.com" className={styles.contactLink}>
                    project.astitv@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div className={styles.contactItem}>
                <div className={styles.iconCircle}>
                  <Phone size={18} className={styles.icon} aria-hidden="true" />
                </div>
                <div className={styles.contactText}>
                  <span className={styles.contactLabel}>PHONE / WHATSAPP</span>
                  <a href="https://wa.me/917982104063" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                    +91 7982104063
                  </a>
                </div>
              </div>

              {/* Instagram */}
              <div className={styles.contactItem}>
                <div className={styles.iconCircle}>
                  <Instagram size={18} className={styles.icon} aria-hidden="true" />
                </div>
                <div className={styles.contactText}>
                  <span className={styles.contactLabel}>INSTAGRAM</span>
                  <a
                    href="https://www.instagram.com/project_.astitva"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                  >
                    @project_.astitva
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className={styles.contactItem}>
                <div className={styles.iconCircle}>
                  <Linkedin size={18} className={styles.icon} aria-hidden="true" />
                </div>
                <div className={styles.contactText}>
                  <span className={styles.contactLabel}>LINKEDIN</span>
                  <a
                    href="https://www.linkedin.com/company/enactus-vips-tc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                  >
                    Enactus VIPS-TC
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className={styles.contactItem}>
                <div className={styles.iconCircle}>
                  <MapPin size={18} className={styles.icon} aria-hidden="true" />
                </div>
                <div className={styles.contactText}>
                  <span className={styles.contactLabel}>LOCATION</span>
                  <span className={styles.contactStatic}>New Delhi &bull; India</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            3. AI CHAT CTA — SAATHI (Refined Editorial Treatment)
            ---------------------------------------------------------------- */}
        <section ref={saathiRef} className={styles.saathiSection} aria-label="AI Companion Saathi">
          <div className={`${styles.revealElement} ${reveals.saathi ? styles.revealed : ''} ${styles.saathiCard}`}>
            <div className={styles.saathiGlow} aria-hidden="true" />
            <div className={styles.saathiContent}>
              <div className={styles.saathiBadge}>
                <Sparkles size={14} className={styles.saathiBadgeIcon} aria-hidden="true" />
                <span>MEET OUR AI COMPANION</span>
              </div>

              <h3 className={styles.saathiHeading}>
                Have a chat with our AI, <span className={styles.accentText}>Saathi</span>.
              </h3>

              <p className={styles.saathiDescription}>
                A private, judgment-free space to reflect, explore your feelings, or find helpful resources whenever you need them — day or night.
              </p>

              <button
                className={styles.saathiButton}
                onClick={() => setShowSaathiModal(true)}
                aria-label="Open conversation with Saathi"
              >
                <span>CHAT WITH SAATHI</span>
                <ArrowRight size={16} className={styles.saathiArrow} aria-hidden="true" />
                <span className={styles.buttonUnderline} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            4. CONTACT FORM (Refined Frontend UI)
            ---------------------------------------------------------------- */}
        <section ref={formRef} className={styles.formSection} aria-label="Send Us a Message">
          <div className={styles.formInner}>
            <div className={`${styles.revealElement} ${reveals.form ? styles.revealed : ''} ${styles.formHeader}`}>
              <span className={styles.sectionEyebrow}>WRITE TO US</span>
              <h2 className={styles.formTitle}>
                Leave us a <em className={styles.accentItalic}>note</em>
              </h2>
              <p className={styles.formSubtitle}>
                We usually respond within 24 to 48 hours. Your message is private and safe with us.
              </p>
            </div>

            {isSubmitted ? (
              <div className={styles.successBanner} role="status">
                <CheckCircle2 size={24} className={styles.successIcon} aria-hidden="true" />
                <div className={styles.successContent}>
                  <h4 className={styles.successTitle}>Thank you for reaching out.</h4>
                  <p className={styles.successText}>
                    We have received your message and a member of the Astitva team will be in touch shortly.
                  </p>
                  <button
                    type="button"
                    className={styles.sendAnotherButton}
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form
                className={`${styles.revealElement} ${reveals.form ? styles.revealed : ''} ${styles.delay100} ${styles.contactForm}`}
                onSubmit={handleSubmit}
                noValidate
              >
                <div className={styles.formGrid}>
                  {/* Name Field */}
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-name" className={styles.formLabel}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      placeholder="How should we address you?"
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                  </div>

                  {/* Email Field */}
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-email" className={styles.formLabel}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      placeholder="Where can we write back to you?"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className={styles.formGroup}>
                  <label htmlFor="contact-message" className={styles.formLabel}>
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us what you're thinking, how we can help, or just say hello..."
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.formTextarea}
                  />
                </div>

                {/* Submit Action */}
                <div className={styles.formActionRow}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.submitButton}
                  >
                    <span>{isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                  <span className={styles.privacyNote}>
                    Your information is never shared with third parties.
                  </span>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* ----------------------------------------------------------------
          SAATHI MODAL (Interactive sanctuary dialogue)
          ---------------------------------------------------------------- */}
      {showSaathiModal && (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="saathi-modal-title"
          onClick={() => setShowSaathiModal(false)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleRow}>
                <div className={styles.saathiAvatarCircle}>
                  <Sparkles size={18} className={styles.accentIcon} />
                </div>
                <div>
                  <h3 id="saathi-modal-title" className={styles.modalTitle}>
                    Saathi &mdash; AI Companion
                  </h3>
                  <span className={styles.modalBadge}>CONFIDENTIAL SANCTUARY</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setShowSaathiModal(false)}
                aria-label="Close Saathi modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalChatStream}>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${styles.chatBubbleRow} ${
                    msg.sender === 'user' ? styles.chatBubbleUser : styles.chatBubbleSaathi
                  }`}
                >
                  {msg.sender === 'saathi' && (
                    <div className={styles.chatAvatarSmall} aria-hidden="true">
                      <Sparkles size={12} />
                    </div>
                  )}
                  <div className={styles.chatBubble}>
                    <p className={styles.chatMessageText}>{msg.text}</p>
                    {msg.action && (
                      <div className={styles.chatActionWrapper}>
                        {msg.action.href.startsWith('#') ? (
                          <button
                            type="button"
                            className={styles.chatActionBtn}
                            onClick={() => {
                              setShowSaathiModal(false);
                              if (onNavigate) onNavigate(msg.action.href.replace('#', ''));
                              else window.location.hash = msg.action.href;
                            }}
                          >
                            <span>{msg.action.label}</span>
                            <ArrowRight size={13} />
                          </button>
                        ) : (
                          <a
                            href={msg.action.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.chatActionBtn}
                          >
                            <span>{msg.action.label}</span>
                            <ArrowRight size={13} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className={`${styles.chatBubbleRow} ${styles.chatBubbleSaathi}`}>
                  <div className={styles.chatAvatarSmall} aria-hidden="true">
                    <Sparkles size={12} />
                  </div>
                  <div className={`${styles.chatBubble} ${styles.chatThinkingBubble}`}>
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick prompts container */}
            <div className={styles.modalPromptSection}>
              <span className={styles.promptHeader}>SUGGESTED CONVERSATIONS:</span>
              <div className={styles.starterPromptChips}>
                <button
                  type="button"
                  className={styles.promptChip}
                  onClick={() => handlePromptClick('feelings')}
                >
                  <MessageCircle size={13} />
                  <span>Talk about my feelings</span>
                </button>
                <button
                  type="button"
                  className={styles.promptChip}
                  onClick={() => handlePromptClick('resources')}
                >
                  <Sparkles size={13} />
                  <span>LGBTQ+ friendly resources</span>
                </button>
                <button
                  type="button"
                  className={styles.promptChip}
                  onClick={() => handlePromptClick('wellness')}
                >
                  <CheckCircle2 size={13} />
                  <span>Mental wellness support</span>
                </button>
              </div>
            </div>

            {/* Custom Chat Input */}
            <form onSubmit={handleSendCustomChat} className={styles.modalInputBar}>
              <input
                type="text"
                placeholder="Ask Saathi a question or share a thought..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className={styles.modalInput}
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className={styles.modalSendBtn}
                aria-label="Send message to Saathi"
              >
                <Send size={15} />
              </button>
            </form>

            <div className={styles.modalFooter}>
              <span className={styles.modalDisclaimer}>
                Note: Saathi provides empathetic conversation and guidance, not emergency clinical care. For 24/7 human crisis support, call Vandrevala Foundation: +91 9999 666 555.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

