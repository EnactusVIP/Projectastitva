import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './Support.module.css';

import communityIllustration from '../assets/support-community-hero.png';

const SUPPORT_PHILOSOPHIES = [
  {
    number: '01',
    concept: 'CARE',
    title: 'Mental Health First',
    statement: 'Your wellbeing comes first.',
    body:
      'Connecting individuals with trained empathetic listeners and guidance because your mental health is not a luxury, it is a right.',
    actionLabel: 'Reach out for guidance',
  },
  {
    number: '02',
    concept: 'CONVERSATION',
    title: 'Safe Conversations',
    statement: 'Being heard can change everything.',
    body:
      'A confidential, judgement-free space to share, process, and be heard. We believe in the transformative power of simply being listened to.',
    actionLabel: 'Begin a conversation',
  },
  {
    number: '03',
    concept: 'COMMUNITY',
    title: 'Community Networks',
    statement: 'Support becomes stronger together.',
    body:
      'Peer-led support circles, group sessions, and community touchpoints because solidarity is a form of care.',
    actionLabel: 'Explore support circles',
  },
];

const HOW_WE_HELP = [
  {
    tag: 'GUIDANCE',
    headline: 'Someone to talk to',
    copy:
      'Whether you are navigating identity, family relationships, mental health, or workplace discrimination Project Astitva is here. Our team connects you with resources, peer counsellors, and community allies who understand.',
  },
  {
    tag: 'RESOURCES',
    headline: 'Curated support pathways',
    copy:
      'From legal aid directories to mental wellness tools, we help you find the right next step not a generic answer, but a human one tailored to where you are right now.',
  },
  {
    tag: 'OUTREACH',
    headline: 'Workshops & awareness',
    copy:
      'We run sensitivity training, awareness workshops, and open dialogue sessions for institutions, workplaces, and schools creating cultures where every person feels seen.',
  },
];

export default function Support({ onNavigate }) {
  const [reveals, setReveals] = useState({
    hero: false,
    pillars: false,
    how: false,
    commitment: false,
    closing: false,
  });

  const [heroParallaxY, setHeroParallaxY] = useState(0);
  const [activePillar, setActivePillar] = useState(0);
  const [isChangingPillar, setIsChangingPillar] = useState(false);

  const heroRef = useRef(null);
  const pillarsRef = useRef(null);
  const howRef = useRef(null);
  const commitmentRef = useRef(null);
  const closingRef = useRef(null);
  const switchTimeoutRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight * 1.2) {
            setHeroParallaxY(Math.min(scrollY * 0.05, 18));
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setReveals({ hero: true, pillars: true, how: true, commitment: true, closing: true });
      return;
    }

    const observers = [];
    const observeSection = (ref, key) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setReveals((prev) => ({ ...prev, [key]: true }));
          }
        },
        { threshold: 0.12, rootMargin: '-5% 0px -15% 0px' }
      );
      obs.observe(ref.current);
      observers.push({ obs, target: ref.current });
    };

    observeSection(heroRef, 'hero');
    observeSection(pillarsRef, 'pillars');
    observeSection(howRef, 'how');
    observeSection(commitmentRef, 'commitment');
    observeSection(closingRef, 'closing');

    return () => {
      observers.forEach(({ obs, target }) => {
        if (target) obs.unobserve(target);
      });
    };
  }, []);

  const handlePillarSelect = useCallback(
    (index) => {
      if (index === activePillar) return;
      setIsChangingPillar(true);
      if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);

      switchTimeoutRef.current = setTimeout(() => {
        setActivePillar(index);
        setIsChangingPillar(false);
      }, 180);
    },
    [activePillar]
  );

  const handleContactClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onNavigate) onNavigate('contact');
    else window.location.hash = '#contact';
  };

  const handleAboutClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onNavigate) onNavigate('about');
    else window.location.hash = '#about';
  };

  const currentPhilosophy = SUPPORT_PHILOSOPHIES[activePillar];

  return (
    <div className={styles.pageContainer}>
      <main>

        {/* ---- HERO ---- */}
        <section
          ref={heroRef}
          className={styles.heroSection}
          aria-label="Support from Project Astitva"
        >
          <div
            className={styles.heroBgWrapper}
            style={{ transform: `translateY(${heroParallaxY}px)` }}
            aria-hidden="true"
          >
            <img
              src={communityIllustration}
              alt=""
              className={`${styles.heroBgImage} ${reveals.hero ? styles.heroBgLoaded : ''}`}
              loading="eager"
            />
            <div className={`${styles.heroOverlay} ${reveals.hero ? styles.heroOverlayLoaded : ''}`} />
          </div>
          <div className={styles.heroTopFade} aria-hidden="true" />
          <div className={styles.heroBottomFade} aria-hidden="true" />

          <div className={styles.heroContentContainer}>
            <div className={styles.heroTextColumn}>
              <div className={`${styles.revealElement} ${reveals.hero ? styles.revealed : ''} ${styles.heroEyebrowWrapper}`}>
                <span className={styles.heroEyebrow}>PROJECT ASTITVA</span>
                <span className={styles.eyebrowLine} aria-hidden="true" />
              </div>

              <h1 className={`${styles.revealElement} ${reveals.hero ? styles.revealed : ''} ${styles.delay100} ${styles.heroTitle}`}>
                <span className={styles.titleLine}>Support</span>
                <span className={styles.titleLineItalic}>& Care</span>
              </h1>

              <div className={`${styles.revealElement} ${reveals.hero ? styles.revealed : ''} ${styles.delay200} ${styles.heroStatement}`}>
                <p className={styles.statementLine}>You are not alone.</p>
                <p className={styles.statementLine}>You never have to be.</p>
                <p className={styles.statementLine}>Help begins here.</p>
              </div>

              <div
                className={`${styles.revealElement} ${reveals.hero ? styles.revealed : ''} ${styles.delay300} ${styles.scrollCue}`}
                aria-hidden="true"
              >
                <span>Scroll to explore</span>
                <div className={styles.scrollCueLine} />
              </div>
            </div>
          </div>
        </section>

        {/* ---- WHAT WE OFFER / SUPPORT PHILOSOPHIES ---- */}
        <section
          ref={pillarsRef}
          className={styles.pillarsSection}
          aria-label="What We Offer — Three ways Astitva creates a space to be heard"
        >
          <div className={styles.pillarsInner}>
            {/* Section Header */}
            <div className={`${styles.revealElement} ${reveals.pillars ? styles.revealed : ''} ${styles.sectionHeader}`}>
              <div className={styles.eyebrowRow}>
                <span className={styles.eyebrowDot} aria-hidden="true" />
                <span className={styles.sectionEyebrow}>WHAT WE OFFER</span>
                <span className={styles.eyebrowLine} aria-hidden="true" />
              </div>

              <h2 className={styles.sectionHeadline}>
                Support that starts with{' '}
                <em className={styles.accentItalic}>listening</em>
              </h2>

              <p className={styles.sectionSubtext}>
                Every person's journey is different. Our support is built around that truth.
              </p>
            </div>

            {/* Editorial Split Composition */}
            <div className={`${styles.editorialWrapper} ${reveals.pillars ? styles.revealed : ''}`}>
              {/* Left Column: Interactive Chapter Navigation */}
              <div className={styles.chapterNavCol} role="tablist" aria-label="Support philosophies">
                {/* Connecting Thread Motif (Desktop) */}
                <div className={styles.connectingThread} aria-hidden="true">
                  <div
                    className={styles.threadProgress}
                    style={{
                      height: `${((activePillar + 0.5) / SUPPORT_PHILOSOPHIES.length) * 100}%`,
                    }}
                  />
                  {SUPPORT_PHILOSOPHIES.map((item, i) => (
                    <div
                      key={`thread-${item.number}`}
                      className={`${styles.threadNode} ${
                        activePillar === i
                          ? styles.threadNodeActive
                          : activePillar > i
                          ? styles.threadNodePassed
                          : ''
                      }`}
                      style={{
                        top: `${((i + 0.5) / SUPPORT_PHILOSOPHIES.length) * 100}%`,
                      }}
                    />
                  ))}
                </div>

                {/* Chapter Selection Tabs */}
                <div className={styles.chapterItems}>
                  {SUPPORT_PHILOSOPHIES.map((pillar, i) => {
                    const isActive = activePillar === i;
                    return (
                      <button
                        key={pillar.number}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        tabIndex={0}
                        className={`${styles.chapterTab} ${
                          isActive ? styles.chapterTabActive : styles.chapterTabInactive
                        }`}
                        onClick={() => handlePillarSelect(i)}
                      >
                        <div className={styles.chapterTabTop}>
                          <span className={styles.chapterNumber}>{pillar.number}</span>
                          <span className={styles.chapterSlash}>/</span>
                          <span className={styles.chapterConcept}>{pillar.concept}</span>
                        </div>
                        <h3 className={styles.chapterTitle}>{pillar.title}</h3>
                        <div className={styles.activeTabIndicator} aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Active Support Philosophy Display */}
              <div
                className={`${styles.activeDisplayCol} ${
                  isChangingPillar ? styles.displayChanging : styles.displayActive
                }`}
                role="tabpanel"
                aria-label={currentPhilosophy.title}
              >
                <div className={styles.displayCard}>
                  <div className={styles.displayMetaRow}>
                    <span className={styles.displayConceptBadge}>
                      {currentPhilosophy.number} &mdash; {currentPhilosophy.concept}
                    </span>
                    <span className={styles.displayTitleBadge}>{currentPhilosophy.title}</span>
                  </div>

                  <h3 className={styles.displayStatement}>
                    &ldquo;{currentPhilosophy.statement}&rdquo;
                  </h3>

                  <p className={styles.displayBody}>
                    {currentPhilosophy.body}
                  </p>

                  <div className={styles.displayActionRow}>
                    <button
                      type="button"
                      className={styles.displayActionBtn}
                      onClick={handleContactClick}
                      aria-label={`${currentPhilosophy.actionLabel} (Go to Contact)`}
                    >
                      <span className={styles.displayActionText}>
                        {currentPhilosophy.actionLabel}
                      </span>
                      <span className={styles.arrowWrap} aria-hidden="true">
                        <ArrowRight size={15} className={styles.displayArrow} />
                      </span>
                    </button>
                  </div>

                  <div className={styles.displayAccentBar} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- HOW WE HELP ---- */}
        <section ref={howRef} className={styles.howSection} aria-label="Our approach to support">
          <div className={styles.howInner}>
            <div className={`${styles.revealElement} ${reveals.how ? styles.revealed : ''} ${styles.howHeader}`}>
              <div className={styles.eyebrowRow}>
                <span className={styles.eyebrowDot} aria-hidden="true" />
                <span className={styles.sectionEyebrow}>HOW WE HELP</span>
                <span className={styles.eyebrowLine} aria-hidden="true" />
              </div>
            </div>

            <div className={styles.howRows}>
              {HOW_WE_HELP.map((item, i) => (
                <div
                  key={item.tag}
                  className={`${styles.howRow} ${reveals.how ? styles.howRowVisible : ''}`}
                  style={{ transitionDelay: reveals.how ? `${i * 140}ms` : '0ms' }}
                >
                  <div className={styles.howLeft}>
                    <span className={styles.howTag}>{item.tag}</span>
                    <h3 className={styles.howHeadline}>{item.headline}</h3>
                  </div>
                  <div className={styles.howDivider} aria-hidden="true" />
                  <div className={styles.howRight}>
                    <p className={styles.howCopy}>{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- COMMITMENT ---- */}
        <section ref={commitmentRef} className={styles.commitmentSection} aria-label="Our commitment">
          <div className={styles.commitmentInner}>
            <div className={styles.rainbowFilament} aria-hidden="true" />
            <p className={`${styles.revealElement} ${reveals.commitment ? styles.revealed : ''} ${styles.commitmentEyebrow}`}>
              OUR COMMITMENT
            </p>
            <blockquote className={`${styles.revealElement} ${reveals.commitment ? styles.revealed : ''} ${styles.delay100} ${styles.commitmentQuote}`}>
              &ldquo;No one should have to earn the right to be cared for.
              Dignity is not conditional &mdash; and neither is our support.&rdquo;
            </blockquote>
            <p className={`${styles.revealElement} ${reveals.commitment ? styles.revealed : ''} ${styles.delay200} ${styles.commitmentBody}`}>
              Project Astitva was built on the belief that LGBTQ+ individuals deserve access to
              compassionate, culturally sensitive support not clinical detachment. Every
              interaction we facilitate is grounded in respect, confidentiality, and genuine care.
            </p>
          </div>
        </section>

        {/* ---- CLOSING CTA ---- */}
        <section ref={closingRef} className={styles.closingSection} aria-label="Get in touch">
          <div className={styles.closingInner}>
            <span className={`${styles.revealElement} ${reveals.closing ? styles.revealed : ''} ${styles.closingTagline}`}>
              EXIST AS YOU ARE
            </span>
            <h2 className={`${styles.revealElement} ${reveals.closing ? styles.revealed : ''} ${styles.delay100} ${styles.closingHeadline}`}>
              Ready to reach out?
            </h2>
            <p className={`${styles.revealElement} ${reveals.closing ? styles.revealed : ''} ${styles.delay200} ${styles.closingSubtext}`}>
              The first step is the hardest. We are here for every step that follows.
            </p>
            <div className={`${styles.revealElement} ${reveals.closing ? styles.revealed : ''} ${styles.delay300} ${styles.closingButtonRow}`}>
              <button className={styles.primaryPill} onClick={handleContactClick} aria-label="Go to Contact Us page">
                Contact Us
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button className={styles.secondaryPill} onClick={handleAboutClick} aria-label="Learn about Project Astitva">
                Learn about us
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
