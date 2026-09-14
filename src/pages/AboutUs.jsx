import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Users, Sparkles } from 'lucide-react';
import Footer from '../components/Footer';
import SDGCard from '../components/SDGCard';
import ChapterRail from '../components/ChapterRail';
import styles from './AboutUs.module.css';

// Community illustration for the hero right-side composition
import communityIllustration from '../assets/community-visual.png';

// Direct asset imports for the official SDG artwork
import sdg3Image from '../assets/E_WEB_03.png';
import sdg4Image from '../assets/E_WEB_04.png';
import sdg10Image from '../assets/E_WEB_10.png';
import sdg16Image from '../assets/E_PRINT_16.jpg';

const STORY_CHAPTERS = [
  { id: 'impact', number: 'SDG', label: 'IMPACT' },
  { id: 'idea', number: '01', label: 'IDEA' },
  { id: 'why', number: '02', label: 'WHY' },
  { id: 'human', number: '03', label: 'SUPPORT' },
  { id: 'ai', number: '04', label: 'AI' },
  { id: 'belief', number: '05', label: 'BELIEF' },
];

const SDG_DATA = [
  {
    number: '3',
    title: 'GOOD HEALTH AND WELL-BEING',
    description: 'Ensuring healthy lives and promoting well-being for all at all ages.',
    image: sdg3Image,
    accentColor: '#4C9F38',
  },
  {
    number: '4',
    title: 'QUALITY EDUCATION',
    description: 'Ensuring inclusive and equitable quality education and promoting lifelong learning opportunities for all.',
    image: sdg4Image,
    accentColor: '#C5192D',
  },
  {
    number: '10',
    title: 'REDUCED INEQUALITIES',
    description: 'Reducing inequalities within and among countries for a fairer and more inclusive world.',
    image: sdg10Image,
    accentColor: '#DD1367',
  },
  {
    number: '16',
    title: 'PEACE, JUSTICE AND STRONG INSTITUTIONS',
    description: 'Promoting peaceful and inclusive societies, providing access to justice for all and building effective, accountable institutions at all levels.',
    image: sdg16Image,
    accentColor: '#00689D',
  },
];

export default function AboutUs({ onNavigate, showFooter = false }) {
  const [activeChapter, setActiveChapter] = useState('hero');
  const [flippedCards, setFlippedCards] = useState({});

  // Chapter element refs
  const heroRef = useRef(null);
  const ideaRef = useRef(null);
  const whyRef = useRef(null);
  const dividerRef = useRef(null);
  const humanRef = useRef(null);
  const aiRef = useRef(null);
  const soulRef = useRef(null);
  const beliefRef = useRef(null);
  const impactRef = useRef(null);
  const closingRef = useRef(null);

  // Visibility states for staggered reveals
  const [reveals, setReveals] = useState({
    hero: false,
    idea: false,
    why: false,
    divider: false,
    human: false,
    ai: false,
    soul: false,
    belief: false,
    impact: false,
    closing: false,
  });

  // Subtle hero illustration vertical parallax (10-20px max movement)
  const [heroParallaxY, setHeroParallaxY] = useState(0);

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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // IntersectionObserver for chapter activations and scroll reveals
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setReveals({
        hero: true,
        idea: true,
        why: true,
        divider: true,
        human: true,
        ai: true,
        soul: true,
        belief: true,
        impact: true,
        closing: true,
      });
      return;
    }

    const observers = [];

    const observeSection = (ref, key) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setReveals((prev) => ({ ...prev, [key]: true }));
            if (key === 'why') {
              setReveals((prev) => ({ ...prev, divider: true }));
            }
          }
        },
        { threshold: 0.15, rootMargin: '-5% 0px -15% 0px' }
      );
      obs.observe(ref.current);
      observers.push({ obs, target: ref.current });
    };

    observeSection(heroRef, 'hero');
    observeSection(ideaRef, 'idea');
    observeSection(whyRef, 'why');
    observeSection(humanRef, 'human');
    observeSection(aiRef, 'ai');
    observeSection(beliefRef, 'belief');
    observeSection(impactRef, 'impact');
    observeSection(closingRef, 'closing');
    observeSection(soulRef, 'soul');

    return () => {
      observers.forEach(({ obs, target }) => {
        if (target) obs.unobserve(target);
      });
    };
  }, []);

  // Precise bidirectional scroll-spy for active chapter rail synchronization
  useEffect(() => {
    const handleScroll = () => {
      const midPoint = window.innerHeight * 0.42;

      // Scan chapters from bottom to top to identify the current reading zone
      const chaptersToCheck = [
        { id: 'belief', ref: beliefRef },
        { id: 'ai', ref: aiRef },
        { id: 'human', ref: humanRef },
        { id: 'why', ref: whyRef },
        { id: 'idea', ref: ideaRef },
        { id: 'impact', ref: impactRef },
      ];

      for (const item of chaptersToCheck) {
        if (item.ref.current) {
          const rect = item.ref.current.getBoundingClientRect();
          if (rect.top <= midPoint) {
            setActiveChapter(item.id);
            return;
          }
        }
      }

      // If scrolled near the top in the hero stage
      if (heroRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        if (heroRect.bottom > midPoint) {
          setActiveChapter('impact');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToChapter = (chapterId) => {
    if (chapterId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveChapter('impact');
      return;
    }
    const map = {
      hero: heroRef,
      idea: ideaRef,
      why: whyRef,
      human: humanRef,
      ai: aiRef,
      belief: beliefRef,
      impact: impactRef,
      soul: soulRef,
    };
    const targetRef = map[chapterId];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
      setActiveChapter(chapterId);
    }
  };

  const handleCardFlip = (num) => {
    setFlippedCards((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  const handleSupportClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onNavigate) {
      onNavigate('support');
    } else {
      window.location.hash = '#support';
    }
  };

  const handleHomeClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onNavigate) {
      onNavigate('home', '#home');
    } else {
      window.location.hash = '#home';
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* --------------------------------------------------------------------
          Interactive Chapter Rail (Right-Edge Desktop + Floating Mobile)
          -------------------------------------------------------------------- */}
      <ChapterRail
        chapters={STORY_CHAPTERS}
        activeChapter={activeChapter}
        onSelectChapter={scrollToChapter}
      />

      <main>
        {/* ------------------------------------------------------------------
            1. HERO STAGE: Monumental Full-Bleed Community Background + Editorial Text
            ------------------------------------------------------------------ */}
        <section
          ref={heroRef}
          className={styles.heroSection}
          aria-label="About Project Astitva"
        >
          {/* Full-bleed Background Community Illustration Layer */}
          <div
            className={styles.heroBgWrapper}
            style={{ transform: `translateY(${heroParallaxY}px)` }}
            aria-hidden="true"
          >
            <img
              src={communityIllustration}
              alt=""
              className={`${styles.heroBgImage} ${
                reveals.hero ? styles.heroBgLoaded : ''
              }`}
              loading="eager"
            />
            {/* Atmospheric dark translucent & gradient overlay for editorial readability */}
            <div
              className={`${styles.heroOverlay} ${
                reveals.hero ? styles.heroOverlayLoaded : ''
              }`}
            />
            {/* Seamless gradient fade into Chapter 01 at the bottom */}
            <div className={styles.heroBottomFade} />
          </div>

          {/* Foreground Editorial Content (Layered over the full background) */}
          <div className={styles.heroContentContainer}>
            <div className={styles.heroTextColumn}>
              <div
                className={`${styles.revealElement} ${
                  reveals.hero ? styles.revealed : ''
                } ${styles.heroEyebrowWrapper}`}
              >
                <span className={styles.heroEyebrow}>PROJECT ASTITVA</span>
                <span className={styles.eyebrowLine} aria-hidden="true" />
              </div>

              <h1
                className={`${styles.revealElement} ${
                  reveals.hero ? styles.revealed : ''
                } ${styles.delay100} ${styles.heroTitle}`}
              >
                <span className={styles.titleLine}>About</span>
                <span className={styles.titleLineItalic}>Us</span>
              </h1>

              <div
                className={`${styles.revealElement} ${
                  reveals.hero ? styles.revealed : ''
                } ${styles.delay200} ${styles.heroStatement}`}
              >
                <p className={styles.statementLine}>A space to talk.</p>
                <p className={styles.statementLine}>A space to be heard.</p>
                <p className={styles.statementLine}>A space to simply exist.</p>
              </div>

              <div
                className={`${styles.revealElement} ${
                  reveals.hero ? styles.revealed : ''
                } ${styles.delay300} ${styles.scrollCue}`}
                aria-hidden="true"
              >
                <span>Scroll to explore</span>
                <div className={styles.scrollCueLine} />
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            2. SUSTAINABLE DEVELOPMENT GOALS: OUR IMPACT
            ------------------------------------------------------------------ */}
        <section
          id="chapter-impact"
          ref={impactRef}
          className={styles.impactSection}
          aria-labelledby="sdg-impact-heading"
        >
          <div className={styles.impactHeader}>
            <span
              className={`${styles.revealElement} ${
                reveals.impact ? styles.revealed : ''
              } ${styles.impactEyebrow}`}
            >
              OUR IMPACT
            </span>
            <h2
              id="sdg-impact-heading"
              className={`${styles.revealElement} ${
                reveals.impact ? styles.revealed : ''
              } ${styles.delay100} ${styles.impactTitle}`}
            >
              Aligned with the Sustainable Development Goals
            </h2>
            <div
              className={`${styles.revealElement} ${
                reveals.impact ? styles.revealed : ''
              } ${styles.delay200} ${styles.impactSubtitleRow}`}
            >
              <p className={styles.impactDescription}>
                Project Astitva directly champions global targets for health,
                inclusive learning, reduced inequality, and institutional justice.
              </p>
            </div>
          </div>

          <div className={styles.sdgGrid}>
            {SDG_DATA.map((sdg, index) => (
              <SDGCard
                key={sdg.number}
                number={sdg.number}
                title={sdg.title}
                description={sdg.description}
                image={sdg.image}
                accentColor={sdg.accentColor}
                isFlipped={!!flippedCards[sdg.number]}
                onFlip={() => handleCardFlip(sdg.number)}
                isVisible={reveals.impact}
                delay={index * 100}
              />
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------------
            3. CHAPTER 01: THE IDEA (Grand Statement + Focused Narrative)
            ------------------------------------------------------------------ */}
        <section
          id="chapter-idea"
          ref={ideaRef}
          className={styles.chapterScene}
          aria-labelledby="chapter-idea-heading"
        >
          <div className={styles.chapterContent}>
            <div
              className={`${styles.revealElement} ${
                reveals.idea ? styles.revealed : ''
              } ${styles.chapterHeader}`}
            >
              <span className={styles.chapterNumber} aria-hidden="true">
                01
              </span>
              <span className={styles.chapterTag}>The Idea</span>
            </div>

            <div className={styles.ideaStage}>
              <h2
                id="chapter-idea-heading"
                className={`${styles.revealElement} ${
                  reveals.idea ? styles.revealed : ''
                } ${styles.delay100} ${styles.grandHeadline}`}
              >
                &ldquo;Everyone deserves a safe space to{' '}
                <span className={styles.grandHeadlineHighlight}>talk</span>,{' '}
                <span className={styles.grandHeadlineHighlight}>be heard</span>,
                and{' '}
                <span className={styles.grandHeadlineHighlight}>
                  feel understood
                </span>
                .&rdquo;
              </h2>

              <div
                className={`${styles.revealElement} ${
                  reveals.idea ? styles.revealed : ''
                } ${styles.delay200} ${styles.editorialNarrativeRow}`}
              >
                <p className={styles.narrativeLead}>
                  An initiative built on an enduring, compassionate truth.
                </p>

                <p className={styles.narrativeBody}>
                  We provide confidential, empathetic, and continuous support
                  ensuring no one has to navigate their journey in silence or
                  isolation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            3. CHAPTER 02: WHY ASTITVA (Asymmetric Visual Tension)
            ------------------------------------------------------------------ */}
        <section
          id="chapter-why"
          ref={whyRef}
          className={styles.chapterScene}
          aria-labelledby="chapter-why-heading"
        >
          <div className={styles.chapterContent}>
            <div
              className={`${styles.revealElement} ${
                reveals.why ? styles.revealed : ''
              } ${styles.chapterHeader}`}
            >
              <span className={styles.chapterNumber} aria-hidden="true">
                02
              </span>
              <span className={styles.chapterTag}>Why Astitva</span>
            </div>

            <div className={styles.whyStage}>
              {/* Left Poetry Callout */}
              <div
                className={`${styles.revealElement} ${
                  reveals.why ? styles.revealed : ''
                } ${styles.whyPoemCol}`}
              >
                <blockquote
                  id="chapter-why-heading"
                  className={styles.whyPoemText}
                >
                  Sometimes,
                  <br />
                  you just need
                  <br />
                  someone to listen.
                </blockquote>
              </div>

              {/* Vertical Animated Divider */}
              <div
                ref={dividerRef}
                className={`${styles.whyVerticalDivider} ${
                  reveals.divider ? styles.dividerDrawn : ''
                }`}
                aria-hidden="true"
              />

              {/* Right Narrative Detail */}
              <div
                className={`${styles.revealElement} ${
                  reveals.why ? styles.revealed : ''
                } ${styles.delay200} ${styles.whyDetailCol}`}
              >
                <div className={styles.challengePillGroup} aria-hidden="true">
                  <span className={styles.challengePill}>Relationships</span>
                  <span className={styles.challengePill}>Identity</span>
                  <span className={styles.challengePill}>Mental Health</span>
                  <span className={styles.challengePill}>Personal Growth</span>
                </div>

                <p className={styles.whyNarrative}>
                  Life can come with questions, uncertainty, and moments when you
                  just need someone to listen. Astitva is here to make that
                  support easier to access, whether you’re dealing with
                  relationships, identity, mental health, personal challenges,
                  or simply having a difficult day.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ------------------------------------------------------------------
            4. CHAPTER 03: HUMAN CONNECTION (Editorial Storytelling)
            ------------------------------------------------------------------ */}
        <section
          id="chapter-human"
          ref={humanRef}
          className={styles.chapterScene}
          aria-labelledby="chapter-human-heading"
        >
          <div className={styles.chapterContent}>
            <div
              className={`${styles.revealElement} ${
                reveals.human ? styles.revealed : ''
              } ${styles.chapterHeader}`}
            >
              <span className={styles.chapterNumber} aria-hidden="true">03</span>
              <span className={styles.chapterTag}>Confidential Compass</span>
            </div>

            <div className={styles.editorialSplitStage}>
              {/* Left: large title + badge */}
              <div className={styles.splitLeft}>
                <h2
                  id="chapter-human-heading"
                  className={`${styles.revealElement} ${
                    reveals.human ? styles.revealed : ''
                  } ${styles.delay100} ${styles.editorialSectionTitle}`}
                >
                  HUMAN<br />CONNECTION
                </h2>
                <div
                  className={`${styles.revealElement} ${
                    reveals.human ? styles.revealed : ''
                  } ${styles.delay200} ${styles.editorialBadgeGroup}`}
                >
                  <Users size={16} className={styles.editorialBadgeIcon} aria-hidden="true" />
                  <span className={styles.editorialBadgeText}>Empathetic &amp; Certified</span>
                </div>
              </div>

              {/* Golden divider — animates in with the section */}
              <div
                className={`${styles.whyVerticalDivider} ${
                  reveals.human ? styles.dividerDrawn : ''
                }`}
                aria-hidden="true"
              />

              {/* Right: narrative copy */}
              <div
                className={`${styles.revealElement} ${
                  reveals.human ? styles.revealed : ''
                } ${styles.delay200} ${styles.splitRight}`}
              >
                <p className={styles.editorialLargeStatement}>
                  One-on-one sessions with trained professionals.
                </p>
                <p className={styles.editorialBodyText}>
                  When you need more than an algorithm real people, real empathy, genuine
                  presence. Astitva connects you to certified counsellors who understand your
                  journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            5. CHAPTER 04: AI CHATBOT (Editorial Storytelling — reversed)
            ------------------------------------------------------------------ */}
        <section
          id="chapter-ai"
          ref={aiRef}
          className={styles.chapterScene}
          aria-labelledby="chapter-ai-heading"
        >
          <div className={styles.chapterContent}>
            <div
              className={`${styles.revealElement} ${
                reveals.ai ? styles.revealed : ''
              } ${styles.chapterHeader}`}
            >
              <span className={styles.chapterNumber} aria-hidden="true">04</span>
              <span className={styles.chapterTag}>24/7 Digital Sanctuary</span>
            </div>

            <div className={`${styles.editorialSplitStage} ${styles.splitReversed}`}>
              {/* Left (reversed → appears on right on desktop): narrative copy */}
              <div
                className={`${styles.revealElement} ${
                  reveals.ai ? styles.revealed : ''
                } ${styles.delay100} ${styles.splitLeft}`}
              >
                <p className={styles.editorialLargeStatement}>
                  Talk, reflect, and find guidance whenever you need it.
                </p>
                <p className={styles.editorialBodyText}>
                  No appointments. No waiting rooms. Our AI is available every hour of every
                  day a private space to process, explore, and find calm.
                </p>
                <div className={styles.editorialBadgeGroup}>
                  <Sparkles size={16} className={styles.editorialBadgeIcon} aria-hidden="true" />
                  <span className={styles.editorialBadgeText}>Private &amp; Always Available</span>
                </div>
              </div>

              {/* Golden divider — animates in with the section */}
              <div
                className={`${styles.whyVerticalDivider} ${
                  reveals.ai ? styles.dividerDrawn : ''
                }`}
                aria-hidden="true"
              />

              {/* Right (reversed → appears on left on desktop): large title */}
              <div
                className={`${styles.revealElement} ${
                  reveals.ai ? styles.revealed : ''
                } ${styles.delay200} ${styles.splitRight}`}
              >
                <h2
                  id="chapter-ai-heading"
                  className={styles.editorialSectionTitle}
                >
                  AI<br />CHATBOT
                </h2>
              </div>
            </div>
          </div>
        </section>


        {/* ------------------------------------------------------------------
            5. CHAPTER 05: THE BELIEF (Emotional Climax — Unified Editorial Grid)
            ------------------------------------------------------------------ */}
        <section
          id="chapter-belief"
          ref={beliefRef}
          className={styles.chapterScene}
          aria-labelledby="chapter-belief-heading"
        >
          <div className={styles.chapterContent}>
            <div
              className={`${styles.revealElement} ${
                reveals.belief ? styles.revealed : ''
              } ${styles.chapterHeader}`}
            >
              <span className={styles.chapterNumber} aria-hidden="true">
                05
              </span>
              <span className={styles.chapterTag}>The Belief</span>
            </div>

            <div className={styles.beliefStage}>
              <h2
                id="chapter-belief-heading"
                className={`${styles.revealElement} ${
                  reveals.belief ? styles.revealed : ''
                } ${styles.delay100} ${styles.beliefHeading}`}
              >
                You don&rsquo;t have to figure everything out{' '}
                <span className={styles.beliefHighlight}>alone</span>.
              </h2>

              <p
                className={`${styles.revealElement} ${
                  reveals.belief ? styles.revealed : ''
                } ${styles.delay200} ${styles.beliefBody}`}
              >
                At the heart of Astitva is the belief that you don’t have to
                figure everything out alone. It’s a space to talk without judgment,
                seek support without hesitation, and simply be yourself.
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            7. CLOSING ACTION & TRANSITION PORTAL
            ------------------------------------------------------------------ */}
        <section
          ref={closingRef}
          className={styles.closingScene}
          aria-label="Closing Call to Action"
        >
          <div
            className={`${styles.revealElement} ${
              reveals.closing ? styles.revealed : ''
            }`}
          >
            <span className={styles.closingTagline}>EXIST AS YOU ARE</span>

            <p className={styles.closingHeadline}>
              Take the first step in a safe space where your story matters.
            </p>

            <div className={styles.closingButtonRow}>
              <button
                type="button"
                className={styles.primaryPill}
                onClick={handleSupportClick}
              >
                <span>Explore Support</span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>

              <button
                type="button"
                className={styles.secondaryPill}
                onClick={handleHomeClick}
              >
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------
            BRAND SOUL & CULTURAL MANIFESTO — Final Signature
            ------------------------------------------------------------------ */}
        <section
          ref={soulRef}
          className={styles.soulScene}
          aria-label="Astitva Soul and Identity"
        >
          <div className={styles.soulContainer}>
            <div
              className={`${styles.revealElement} ${
                reveals.soul ? styles.revealed : ''
              } ${styles.rainbowFilament}`}
              aria-hidden="true"
            />

            <h2
              className={`${styles.revealElement} ${
                reveals.soul ? styles.revealed : ''
              } ${styles.delay100} ${styles.soulBrandTitle}`}
            >
              <span>ASTITVA</span>
              <span className={styles.soulSeparator}>|</span>
              <span className={styles.hindiIdentity} lang="hi">
                अस्तित्व
              </span>
            </h2>

            <p
              className={`${styles.revealElement} ${
                reveals.soul ? styles.revealed : ''
              } ${styles.delay200} ${styles.soulEnglish}`}
            >
              &ldquo;I am the path that has not been paved yet but I will be the
              identity that can never be erased&rdquo;
            </p>

            <p
              className={`${styles.revealElement} ${
                reveals.soul ? styles.revealed : ''
              } ${styles.delay300} ${styles.soulHindi}`}
              lang="hi"
            >
              मैं वो राह हूँ जो अभी बनी नहीं, मैं वो अस्तित्व हूँ जो कभी मिटेगा
              नहीं।
            </p>
          </div>
        </section>
      </main>

      {/* Persistent Project Astitva Footer */}
      {showFooter && <Footer onNavigate={onNavigate} />}
    </div>
  );
}
