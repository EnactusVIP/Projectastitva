import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowDown, MessageCircle, BookOpen, Users } from 'lucide-react';
import foundation from './EditorialFoundation.module.css';
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
  const [activePillar, setActivePillar] = useState(0);
  const pillarsRef = useRef(null);
  const tabRefs = useRef([]);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const exploreSupport = () => {
    pillarsRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
    pillarsRef.current?.focus({ preventScroll: true });
  };

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

  const handleTabKey = (event, index) => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % SUPPORT_PHILOSOPHIES.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + SUPPORT_PHILOSOPHIES.length - 1) % SUPPORT_PHILOSOPHIES.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = SUPPORT_PHILOSOPHIES.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActivePillar(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className={`${foundation.surface} ${styles.pageContainer}`}>
      <main>

        <section className={styles.supportHero} aria-labelledby="support-title">
          <div className={styles.heroComposition}>
            <div className={styles.heroCopy}>
              <p className={styles.heroLabel}>PROJECT ASTITVA</p>
              <h1 id="support-title" className={styles.supportTitle}>Support <em>& Care</em></h1>
              <div className={styles.supportStatement}>
                <p>You are not alone.</p>
                <p>You never have to be.</p>
                <p>Help begins here.</p>
              </div>
              <button type="button" className={styles.exploreButton} onClick={exploreSupport}
                aria-label="Find your support below">
                <ArrowDown size={20} aria-hidden="true" /><span>Find your support</span>
              </button>
            </div>
            <div className={styles.communityArtwork}>
              <img src={communityIllustration} width="1024" height="409"
                alt="An inclusive community sharing conversation, with rainbow details celebrating LGBTQ+ identities" />
            </div>
          </div>
        </section>

        {/* ---- WHAT WE OFFER / SUPPORT PHILOSOPHIES ---- */}
        <section
          ref={pillarsRef}
          id="support-options"
          tabIndex={-1}
          className={styles.pillarsSection}
          aria-labelledby="support-options-heading"
        >
          <div className={styles.pillarsInner}>
            {/* Section Header */}
            <div className={styles.sectionHeader}>
              <div className={styles.eyebrowRow}>
                <span className={styles.eyebrowDot} aria-hidden="true" />
                <span className={styles.sectionEyebrow}>WHAT WE OFFER</span>
                <span className={styles.eyebrowLine} aria-hidden="true" />
              </div>

              <h2 id="support-options-heading" className={styles.sectionHeadline}>
                Support that starts with{' '}
                <em className={styles.accentItalic}>listening</em>
              </h2>

              <p className={styles.sectionSubtext}>
                Every person's journey is different. Our support is built around that truth.
              </p>
            </div>

            <div className={styles.supportOptions}>
              <div className={styles.categoryList} role="tablist" aria-label="Support philosophies" aria-orientation="vertical">
                {SUPPORT_PHILOSOPHIES.map((pillar, i) => (
                  <button key={pillar.number} type="button" role="tab"
                    id={`support-tab-${i}`} aria-controls={`support-panel-${i}`}
                    aria-selected={activePillar === i} tabIndex={activePillar === i ? 0 : -1}
                    ref={el => { tabRefs.current[i] = el; }}
                    className={styles.categoryTab} onClick={() => setActivePillar(i)}
                    onKeyDown={event => handleTabKey(event, i)}>
                    <span className={styles.categoryMeta}>{pillar.number} / {pillar.concept}</span>
                    <span className={styles.categoryTitle}>{pillar.title}</span>
                    <ArrowRight className={styles.selectedArrow} size={19} aria-hidden="true" />
                  </button>
                ))}
              </div>
              <div className={styles.panels}>
                {SUPPORT_PHILOSOPHIES.map((pillar, i) => (
                  <div key={pillar.number} id={`support-panel-${i}`} role="tabpanel"
                    aria-labelledby={`support-tab-${i}`} tabIndex={0} hidden={activePillar !== i}
                    className={styles.supportPanel}>
                    <p className={styles.panelLabel}>{pillar.number} — {pillar.concept}</p>
                    <h3 className={styles.panelStatement}>&ldquo;{pillar.statement}&rdquo;</h3>
                    <p className={styles.panelBody}>{pillar.body}</p>
                    <a href="#contact" onClick={handleContactClick} className={styles.textLink}>
                      {pillar.actionLabel} <ArrowRight size={17} aria-hidden="true" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.howSection} aria-labelledby="how-heading">
          <div className={styles.sectionInner}>
            <h2 id="how-heading" className={styles.sectionEyebrow}>HOW WE HELP</h2>
            <div className={styles.howRows}>
              {HOW_WE_HELP.map((item, i) => {
                const Marker = [MessageCircle, BookOpen, Users][i];
                return (
                  <div key={item.tag} className={styles.howRow}>
                    <div className={styles.howLeft}>
                      <Marker size={22} strokeWidth={1.4} className={styles.serviceMarker} aria-hidden="true" />
                      <div>
                        <p className={styles.howTag}>{item.tag}</p>
                        <h3 className={styles.howHeadline}>{item.headline}</h3>
                      </div>
                    </div>
                    <div className={styles.howRight}>
                      <p className={styles.howCopy}>{item.copy}</p>
                      <a href="#contact" onClick={handleContactClick} className={styles.textLink}>
                        {['Contact the team', 'Find your support pathway', 'Talk to us about workshops'][i]}
                        <ArrowRight size={16} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.commitmentSection} aria-labelledby="commitment-heading">
          <div className={styles.commitmentInner}>
            <span className={styles.quotationMark} aria-hidden="true">“</span>
            <h2 id="commitment-heading" className={styles.sectionEyebrow}>OUR COMMITMENT</h2>
            <blockquote className={styles.commitmentQuote}>
              &ldquo;No one should have to earn the right to be cared for.
              Dignity is not conditional. Neither is our support.&rdquo;
            </blockquote>
            <p className={styles.commitmentBody}>
              Project Astitva was built on the belief that LGBTQ+ individuals deserve access to
              compassionate, culturally sensitive support not clinical detachment. Every
              interaction we facilitate is grounded in respect, confidentiality, and genuine care.
            </p>
          </div>
        </section>

        <section className={styles.closingSection} aria-labelledby="closing-heading">
          <div className={styles.closingInner}>
            <p className={styles.sectionEyebrow}>EXIST AS YOU ARE</p>
            <h2 id="closing-heading" className={styles.closingHeadline}>Ready to reach out?</h2>
            <p className={styles.closingSubtext}>
              The first step is the hardest. We are here for every step that follows.
            </p>
            <div className={styles.closingButtonRow}>
              <a href="#contact" className={styles.primaryAction} onClick={handleContactClick}>
                Contact Us <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a href="#about" className={styles.secondaryAction} onClick={handleAboutClick}>
                Learn about us <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
