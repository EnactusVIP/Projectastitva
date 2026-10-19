import { useState, useEffect, useCallback } from 'react';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Support from './pages/Support';
import ArtTherapy from './pages/ArtTherapy';
import Contact from './pages/Contact';
import Newsletter from './pages/Newsletter';
import Navbar from './components/Navbar';
import CommunityStrip from './components/CommunityStrip';
import Footer from './components/Footer';
import LanguageTransition from './components/LanguageTransition';

function App() {
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#about' || hash === '#about-us') return 'about';
    if (hash === '#support') return 'support';
    if (hash === '#art-therapy' || hash === '#arttherapy') return 'arttherapy';
    if (hash === '#contact' || hash === '#contact-us') return 'contact';
    if (hash === '#newsletter') return 'newsletter';
    return 'home';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Transition plays ONLY when landing on or reloading the Home page link
  const [showIntro, setShowIntro] = useState(() => {
    const hash = window.location.hash;
    const isOther =
      hash === '#about' ||
      hash === '#about-us' ||
      hash === '#support' ||
      hash === '#art-therapy' ||
      hash === '#arttherapy' ||
      hash === '#contact' ||
      hash === '#contact-us' ||
      hash === '#newsletter';
    return !isOther;
  });

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  const performNavigation = useCallback((targetPage, targetSection) => {
    setIsTransitioning(true);

    setTimeout(() => {
      setActivePage(targetPage);

      if (targetPage === 'about') {
        window.history.pushState(null, '', '#about');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (targetPage === 'support') {
        window.history.pushState(null, '', '#support');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (targetPage === 'arttherapy') {
        window.history.pushState(null, '', '#art-therapy');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (targetPage === 'contact') {
        window.history.pushState(null, '', '#contact');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (targetPage === 'newsletter') {
        window.history.pushState(null, '', '#newsletter');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        const destHash = targetSection || '#home';
        window.history.pushState(null, '', destHash);

        if (targetSection && targetSection !== '#home') {
          setTimeout(() => {
            const targetElement = document.querySelector(targetSection);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'instant' });
            }
          }, 60);
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }

      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 220);
  }, []);

  const handleNavigate = useCallback(
    (page, section) => {
      if (page === activePage) {
        if (page === 'home' && section) {
          const el = document.querySelector(section);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            window.history.replaceState(null, '', section);
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      performNavigation(page, section);
    },
    [activePage, performNavigation]
  );

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      const isAboutHash = hash === '#about' || hash === '#about-us';
      const isSupportHash = hash === '#support';
      const isArtTherapyHash = hash === '#art-therapy' || hash === '#arttherapy';
      const isContactHash = hash === '#contact' || hash === '#contact-us';
      const isNewsletterHash = hash === '#newsletter';

      if (isAboutHash && activePage !== 'about') {
        performNavigation('about');
      } else if (isSupportHash && activePage !== 'support') {
        performNavigation('support');
      } else if (isArtTherapyHash && activePage !== 'arttherapy') {
        performNavigation('arttherapy');
      } else if (isContactHash && activePage !== 'contact') {
        performNavigation('contact');
      } else if (isNewsletterHash && activePage !== 'newsletter') {
        performNavigation('newsletter');
      } else if (!isAboutHash && !isSupportHash && !isArtTherapyHash && !isContactHash && !isNewsletterHash && activePage !== 'home') {
        performNavigation('home', hash);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [activePage, performNavigation]);

  return (
    <div className="app-layout">
      {/* Multilingual intro transition ONLY on Home page reload / landing */}
      {showIntro && activePage === 'home' && (
        <LanguageTransition
          onComplete={handleIntroComplete}
        />
      )}

      <Navbar activePage={activePage} onNavigate={handleNavigate} />
      <div
        className={`page-transition-container ${
          isTransitioning ? 'page-entering' : 'page-active'
        }`}
      >
        {activePage === 'about' && (
          <AboutUs onNavigate={handleNavigate} />
        )}
        {activePage === 'support' && (
          <Support onNavigate={handleNavigate} />
        )}
        {activePage === 'arttherapy' && (
          <ArtTherapy onNavigate={handleNavigate} />
        )}
        {activePage === 'contact' && (
          <Contact onNavigate={handleNavigate} />
        )}
        {activePage === 'newsletter' && (
          <Newsletter onNavigate={handleNavigate} />
        )}
        {activePage === 'home' && (
          <Home onNavigate={handleNavigate} showNavbar={false} />
        )}
      </div>
      <Footer onNavigate={handleNavigate} />
      <CommunityStrip />
    </div>
  );
}

export default App;
