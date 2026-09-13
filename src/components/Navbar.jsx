import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import enactusLogo from '../assets/enactus-logo.png';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { name: 'Home', href: '#home', number: '01', subtitle: 'Sanctuary & Community' },
  { name: 'About Us', href: '#about', number: '02', subtitle: 'Our Story & Purpose' },
  { name: 'Support', href: '#support', number: '03', subtitle: 'Care & Safe Expression' },
  { name: 'Art Therapy', href: '#art-therapy', number: '04', subtitle: 'Creative Healing' },
  { name: 'Newsletter', href: '#newsletter', number: '05', subtitle: 'Curated Publications' },
  { name: 'Contact Us', href: '#contact', number: '06', subtitle: 'Get In Touch' },
];

export default function Navbar({ activePage = 'home', onNavigate }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(
    activePage === 'about'
      ? '#about'
      : activePage === 'support'
      ? '#support'
      : activePage === 'arttherapy'
      ? '#art-therapy'
      : activePage === 'contact'
      ? '#contact'
      : activePage === 'newsletter'
      ? '#newsletter'
      : '#home'
  );

  useEffect(() => {
    if (activePage === 'about') {
      setActiveLink('#about');
    } else if (activePage === 'support') {
      setActiveLink('#support');
    } else if (activePage === 'arttherapy') {
      setActiveLink('#art-therapy');
    } else if (activePage === 'contact') {
      setActiveLink('#contact');
    } else if (activePage === 'newsletter') {
      setActiveLink('#newsletter');
    } else if (
      window.location.hash &&
      window.location.hash !== '#about' &&
      window.location.hash !== '#support' &&
      window.location.hash !== '#art-therapy' &&
      window.location.hash !== '#arttherapy' &&
      window.location.hash !== '#contact' &&
      window.location.hash !== '#newsletter'
    ) {
      setActiveLink(window.location.hash);
    } else {
      setActiveLink('#home');
    }
  }, [activePage]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (activePage === 'home' && window.location.hash) {
        setActiveLink(window.location.hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activePage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleLinkClick = (e, href) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setIsMenuOpen(false);

    if (onNavigate) {
      if (href === '#about') {
        onNavigate('about');
      } else if (href === '#support') {
        onNavigate('support');
      } else if (href === '#art-therapy' || href === '#arttherapy') {
        onNavigate('arttherapy');
      } else if (href === '#contact') {
        onNavigate('contact');
      } else if (href === '#newsletter') {
        onNavigate('newsletter');
      } else if (href === '#home') {
        onNavigate('home', '#home');
      } else {
        onNavigate('home', href);
      }
    } else {
      window.location.hash = href;
    }
  };

  return (
    <nav
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className={styles.container}>
        {/* Left: Enactus Logo */}
        <a
          href="#home"
          className={styles.logoLink}
          aria-label="Enactus Home"
          onClick={(e) => handleLinkClick(e, '#home')}
        >
          <img
            src={enactusLogo}
            alt="Enactus Logo"
            className={styles.logo}
          />
        </a>

        {/* Right: Desktop Navigation Links */}
        <ul className={styles.desktopNav}>
          {NAV_LINKS.map((link) => {
            const isActive =
              (activePage === 'home' && link.href === '#home') ||
              (activePage === 'about' && link.href === '#about') ||
              (activePage === 'support' && link.href === '#support') ||
              (activePage === 'arttherapy' && (link.href === '#art-therapy' || link.href === '#arttherapy')) ||
              (activePage === 'newsletter' && link.href === '#newsletter') ||
              (activePage === 'contact' && link.href === '#contact');

            return (
              <li key={link.href} className={styles.navItem}>
                <a
                  href={link.href}
                  className={`${styles.navLink} ${isActive ? styles.activeLink : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {link.name}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Mobile: Hamburger Button */}
        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          {isMenuOpen ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        id="mobile-nav-menu"
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!isMenuOpen}
      >
        {/* Drawer Header */}
        <div className={styles.mobileDrawerHeader}>
          <div className={styles.mobileBrandRow}>
            <span className={styles.mobileBrandDot} aria-hidden="true" />
            <span className={styles.mobileBrandEyebrow}>NAVIGATION</span>
          </div>
          <button
            type="button"
            className={styles.mobileCloseBtn}
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        {/* Links List */}
        <ul className={styles.mobileNavList}>
          {NAV_LINKS.map((link) => {
            const isActive =
              (activePage === 'home' && link.href === '#home') ||
              (activePage === 'about' && link.href === '#about') ||
              (activePage === 'support' && link.href === '#support') ||
              (activePage === 'arttherapy' && (link.href === '#art-therapy' || link.href === '#arttherapy')) ||
              (activePage === 'newsletter' && link.href === '#newsletter') ||
              (activePage === 'contact' && link.href === '#contact');

            return (
              <li key={link.href} className={styles.mobileNavItem}>
                <a
                  href={link.href}
                  className={`${styles.mobileNavLink} ${isActive ? styles.mobileActiveLink : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  <span className={styles.mobileLinkNum}>{link.number}</span>
                  <div className={styles.mobileLinkTextCol}>
                    <span className={styles.mobileLinkName}>{link.name}</span>
                    <span className={styles.mobileLinkSub}>{link.subtitle}</span>
                  </div>
                  <ArrowRight size={16} className={styles.mobileLinkArrow} aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Drawer Footer */}
        <div className={styles.mobileDrawerFooter}>
          <p className={styles.mobileFooterText}>Project Astitva &bull; Enactus VIPS-TC</p>
          <span className={styles.mobileFooterTagline}>Exist As You Are</span>
        </div>
      </div>
    </nav>
  );
}
