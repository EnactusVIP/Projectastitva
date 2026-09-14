import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, Check, X, BookOpen, Clock, Tag } from 'lucide-react';
import styles from './Newsletter.module.css';

const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'articles', label: 'ARTICLES' },
  { id: 'news', label: 'NEWS UPDATES' },
];

const TOPICS = [
  { id: 'all', label: 'ALL TOPICS' },
  { id: 'coming-out', label: 'COMING OUT' },
  { id: 'helpful-tips', label: 'HELPFUL TIPS' },
  { id: 'family', label: 'COMING OUT TO FAMILY' },
  { id: 'acceptance', label: 'WILL THEY ACCEPT ME?' },
  { id: 'friends', label: 'COMING OUT TO FRIENDS' },
  { id: 'newsletters', label: 'NEWSLETTERS' },
];

const CONTENT_ITEMS = [
  {
    id: '01',
    number: '01',
    title: 'Coming Out & Finding Your Voice',
    synopsis: 'A thoughtful reflection on understanding your timing, honoring personal boundaries, and speaking your truth with patience.',
    category: 'articles',
    categoryLabel: 'ARTICLE',
    topic: 'coming-out',
    topicLabel: 'COMING OUT',
    readTime: '4 min read',
    body: `Coming out is neither an obligation nor a single moment in time. It is a quiet conversation you have with yourself first, and then, only when you choose, with the world around you.\n\nThere is no prescribed timeline, no benchmark of courage that requires you to declare who you are before you feel safe to do so. Your identity is whole and valid whether spoken aloud to others or cherished privately within yourself.\n\nTake space. Find your trusted allies first. When you speak, speak from a place of self-love rather than a need for external validation.`,
  },
  {
    id: '02',
    number: '02',
    title: 'When You Are Not Ready To Tell Them',
    synopsis: 'Navigating family expectations, personal safety, and the quiet courage of protecting your peace until the right time.',
    category: 'articles',
    categoryLabel: 'ARTICLE',
    topic: 'family',
    topicLabel: 'COMING OUT TO FAMILY',
    readTime: '5 min read',
    body: `The pressure to disclose your identity to family can feel overwhelming, especially when conversations around dinner tables carry unspoken conditions.\n\nRemember: choosing silence in an unsupportive environment is not shame it is self-preservation. You owe your safety and emotional well-being first priority. Building an independent support system outside of family often gives you the strength to navigate home relationships with greater confidence.`,
  },
  {
    id: '03',
    number: '03',
    title: 'Helpful Tips For Difficult Days',
    synopsis: 'A gentle toolkit for emotional grounding, sensory decompression, and community reach-out when the world feels heavy.',
    category: 'articles',
    categoryLabel: 'RESOURCE',
    topic: 'helpful-tips',
    topicLabel: 'HELPFUL TIPS',
    readTime: '3 min read',
    body: `Some days require nothing more than enduring them. When overwhelming feelings arise:\n\n1. Anchor in physical sensations: Feel your feet grounded on the earth, inhale deeply for four counts, hold for four, exhale for six.\n2. Step away from digital noise: Step back from comment sections and opinion threads that question your humanity.\n3. Reach out to one safe person: Send a simple text: "I just need a gentle reminder that I'm okay today." You are not alone.`,
  },
  {
    id: '04',
    number: '04',
    title: 'Will They Accept Me? Preparing Your Heart & Mind',
    synopsis: 'Understanding that others’ reactions reflect their own unlearning, not your inherent worth or dignity.',
    category: 'articles',
    categoryLabel: 'ARTICLE',
    topic: 'acceptance',
    topicLabel: 'WILL THEY ACCEPT ME?',
    readTime: '4 min read',
    body: `It is natural to hope for immediate acceptance from those you care about. Yet often, loved ones need time to unlearn generations of social conditioning.\n\nTheir confusion or initial hesitation does not diminish the beauty of who you are. Give yourself grace, set firm boundaries around disrespect, and surround yourself with peers who celebrate your existence unconditionally.`,
  },
  {
    id: '05',
    number: '05',
    title: 'Project Astitva Dispatch Issue 01: Community & Belonging',
    synopsis: 'A monthly summary of grassroots conversations, partner milestones, and our ongoing mission to build inclusive spaces.',
    category: 'news',
    categoryLabel: 'NEWS UPDATE',
    topic: 'newsletters',
    topicLabel: 'NEWSLETTERS',
    readTime: '3 min read',
    body: `This month at Project Astitva, we expanded our community listening circles and collaborated with regional advocates across educational institutions.\n\nHighlights include:\n- Over 120 students attended our sensitivity and identity dialogue sessions.\n- Development of the forthcoming Art Therapy safe space to foster creative healing.\n- Ongoing expansion of our Saathi guidance companion. Thank you for walking alongside us.`,
  },
  {
    id: '06',
    number: '06',
    title: 'Coming Out to Friends: Choosing Your Allies',
    synopsis: 'How to recognize empathetic friendships, set healthy boundaries, and nurture chosen family with care.',
    category: 'articles',
    categoryLabel: 'ARTICLE',
    topic: 'friends',
    topicLabel: 'COMING OUT TO FRIENDS',
    readTime: '4 min read',
    body: `Friends often become our chosen family. When deciding to share your identity with a friend, observe how they speak about other marginalized communities. True friendship does not merely tolerate who you are it embraces and protects your authenticity.`,
  },
  {
    id: '07',
    number: '07',
    title: 'Building Inclusive Spaces in Everyday Life',
    synopsis: 'Practical actions anyone can take in colleges, workplaces, and neighborhoods to signal warmth and safety.',
    category: 'news',
    categoryLabel: 'NEWS UPDATE',
    topic: 'helpful-tips',
    topicLabel: 'HELPFUL TIPS',
    readTime: '3 min read',
    body: `Creating inclusion doesn't require grand gestures; it thrives in consistent, quiet actions: using affirming language, intervening against exclusionary humor, and actively listening to lived experiences without defensiveness.`,
  },
];

export default function Newsletter({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [activeArticle, setActiveArticle] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const emailInputRef = useRef(null);
  const heroRef = useRef(null);
  const signupRef = useRef(null);
  const contentRef = useRef(null);

  const [reveals, setReveals] = useState({
    hero: false,
    signup: false,
    content: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setReveals({ hero: true, signup: true, content: true });
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
        { threshold: 0.12, rootMargin: '-5% 0px -15% 0px' }
      );
      obs.observe(ref.current);
      observers.push({ obs, target: ref.current });
    };

    observe(heroRef, 'hero');
    observe(signupRef, 'signup');
    observe(contentRef, 'content');

    return () => {
      observers.forEach(({ obs, target }) => {
        if (target) obs.unobserve(target);
      });
    };
  }, []);

  // Filter content smoothly
  const handleCategoryChange = (catId) => {
    if (catId === selectedCategory) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedCategory(catId);
      setIsTransitioning(false);
    }, 200);
  };

  const handleTopicChange = (topicId) => {
    if (topicId === selectedTopic) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedTopic(topicId);
      setIsTransitioning(false);
    }, 200);
  };

  const filteredItems = useMemo(() => {
    return CONTENT_ITEMS.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchTopic = selectedTopic === 'all' || item.topic === selectedTopic;
      return matchCategory && matchTopic;
    });
  }, [selectedCategory, selectedTopic]);

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    // Clean frontend state structure ready for backend connection
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <div className={styles.pageContainer}>
      <main>
        {/* ----------------------------------------------------------------
            1. HERO SECTION
            ---------------------------------------------------------------- */}
        <section ref={heroRef} className={styles.heroSection} aria-label="Newsletter Hero">
          <div className={styles.heroInner}>
            <div className={`${styles.revealElement} ${reveals.hero ? styles.revealed : ''} ${styles.eyebrowRow}`}>
              <span className={styles.heroEyebrow}>NEWSLETTER</span>
              <span className={styles.eyebrowLine} aria-hidden="true" />
            </div>

            <h1 className={`${styles.revealElement} ${reveals.hero ? styles.revealed : ''} ${styles.delay100} ${styles.heroTitle}`}>
              <span className={styles.titleLine}>Stay informed.</span>
              <span className={styles.titleLineItalic}>Stay connected.</span>
            </h1>

            <p className={`${styles.revealElement} ${reveals.hero ? styles.revealed : ''} ${styles.delay200} ${styles.heroSubtitle}`}>
              Thoughtful stories, resources and updates for the journey.
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            2. SUBSCRIBE AREA
            ---------------------------------------------------------------- */}
        <section ref={signupRef} className={styles.signupSection} aria-label="Subscribe to Monthly Newsletter">
          <div className={`${styles.revealElement} ${reveals.signup ? styles.revealed : ''} ${styles.signupCard}`}>
            <div className={styles.signupTextCol}>
              <span className={styles.signupEyebrow}>MONTHLY NEWSLETTERS</span>
              <h2 className={styles.signupHeading}>
                Stay updated <br />
                <span className={styles.accentItalic}>and connected.</span>
              </h2>
            </div>

            <div className={styles.signupFormCol}>
              {isSubscribed ? (
                <div className={styles.subscriptionSuccess} role="status">
                  <div className={styles.checkCircle}>
                    <Check size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className={styles.successHeading}>You&apos;re on the list.</h4>
                    <p className={styles.successSubtext}>
                      Thank you for joining our circle. We share stories with care and zero spam.
                    </p>
                  </div>
                </div>
              ) : (
                <form className={styles.subscribeForm} onSubmit={handleSubscribeSubmit} noValidate>
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      ref={emailInputRef}
                      type="email"
                      id="newsletter-email"
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.emailInput}
                    />
                    <button
                      type="submit"
                      className={styles.subscribeButton}
                      aria-label="Subscribe to monthly newsletter"
                    >
                      <span>SUBSCRIBE</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <span className={styles.formNote}>
                    No algorithms or spam. Only authentic reflections and community dispatches.
                  </span>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------
            3. CONTENT DISCOVERY: FILTERS & EDITORIAL LIST
            ---------------------------------------------------------------- */}
        <section ref={contentRef} className={styles.contentSection} aria-label="Publications & Resources">
          <div className={styles.contentInner}>

            {/* Category Navigation (Editorial Underline Style) */}
            <nav className={styles.categoryNav} aria-label="Content categories">
              <div className={styles.categoryList}>
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`${styles.categoryTab} ${isActive ? styles.categoryTabActive : ''}`}
                      onClick={() => handleCategoryChange(cat.id)}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span>{cat.label}</span>
                      {isActive && <span className={styles.activeUnderline} aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Topic Filter Tags (Horizontal editorial tags, scrollable on mobile) */}
            <div className={styles.topicScrollContainer} role="region" aria-label="Filter by topic">
              <div className={styles.topicTrack}>
                {TOPICS.map((topic) => {
                  const isActive = selectedTopic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      className={`${styles.topicPill} ${isActive ? styles.topicPillActive : ''}`}
                      onClick={() => handleTopicChange(topic.id)}
                      aria-pressed={isActive}
                    >
                      <span>{topic.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section Heading */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>FROM THE ASTITVA JOURNAL</span>
              <h3 className={styles.sectionTitle}>
                Latest Stories &amp; Updates
              </h3>
            </div>

            {/* Content List */}
            <div
              className={`${styles.itemsContainer} ${isTransitioning ? styles.itemsExiting : styles.itemsActive}`}
            >
              {filteredItems.length === 0 ? (
                /* Intentional Minimal Empty State */
                <div className={styles.emptyState}>
                  <p className={styles.emptyHeading}>MORE STORIES ARE COMING.</p>
                  <p className={styles.emptySubtext}>
                    New resources and community updates in this category will appear here soon.
                  </p>
                  <button
                    type="button"
                    className={styles.clearFilterButton}
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedTopic('all');
                    }}
                  >
                    View All Stories
                  </button>
                </div>
              ) : (
                <div className={styles.itemList}>
                  {filteredItems.map((item) => (
                    <article
                      key={item.id}
                      className={styles.editorialRow}
                      onClick={() => setActiveArticle(item)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Read ${item.title}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveArticle(item);
                        }
                      }}
                    >
                      <div className={styles.rowNumberCol}>
                        <span className={styles.rowNumber}>{item.number}</span>
                      </div>

                      <div className={styles.rowBodyCol}>
                        <div className={styles.rowMeta}>
                          <span className={styles.rowCategory}>{item.categoryLabel}</span>
                          <span className={styles.metaDot} aria-hidden="true" />
                          <span className={styles.rowTopic}>{item.topicLabel}</span>
                          <span className={styles.metaDot} aria-hidden="true" />
                          <span className={styles.rowReadTime}>{item.readTime}</span>
                        </div>

                        <h4 className={styles.rowTitle}>{item.title}</h4>
                        <p className={styles.rowSynopsis}>{item.synopsis}</p>
                      </div>

                      <div className={styles.rowActionCol}>
                        <span className={styles.readLabel}>READ</span>
                        <ArrowRight size={18} className={styles.rowArrow} aria-hidden="true" />
                      </div>

                      <div className={styles.rowExpandDivider} aria-hidden="true" />
                    </article>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>
      </main>

      {/* ----------------------------------------------------------------
          ARTICLE PREVIEW MODAL (Full reading drawer — zero dead links)
          ---------------------------------------------------------------- */}
      {activeArticle && (
        <div
          className={styles.modalBackdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-modal-title"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalMetaRow}>
                <span className={styles.modalCategoryBadge}>{activeArticle.categoryLabel}</span>
                <span className={styles.metaDot} aria-hidden="true" />
                <span className={styles.modalTopicBadge}>{activeArticle.topicLabel}</span>
                <span className={styles.metaDot} aria-hidden="true" />
                <span className={styles.modalReadTime}>{activeArticle.readTime}</span>
              </div>
              <button
                type="button"
                className={styles.modalCloseButton}
                onClick={() => setActiveArticle(null)}
                aria-label="Close article preview"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <h3 id="article-modal-title" className={styles.modalArticleTitle}>
                {activeArticle.title}
              </h3>

              <div className={styles.modalDivider} aria-hidden="true" />

              <div className={styles.modalTextContent}>
                {activeArticle.body.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className={styles.modalParagraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <span className={styles.modalSignature}>
                Project Astitva &mdash; An initiative for dignity and authentic existence.
              </span>
              <button
                type="button"
                className={styles.modalReturnBtn}
                onClick={() => setActiveArticle(null)}
              >
                Back to stories
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
