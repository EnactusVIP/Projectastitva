import { Instagram, Linkedin, Mail, Phone, ArrowRight } from 'lucide-react';
import enactusLogo from '../assets/enactus-vips-tc-lockup.png';
import styles from './Footer.module.css';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Support', href: '#support' },
  { label: 'Art Therapy', href: '#art-therapy' },
  { label: 'Newsletter', href: '#newsletter' },
  { label: 'Contact Us', href: '#contact' },
];

export default function Footer({ onNavigate }) {
  const handleNavClick = (e, href) => {
    if (onNavigate) {
      e.preventDefault();
      if (href === '#about') {
        onNavigate('about');
      } else if (href === '#support') {
        onNavigate('support');
      } else if (href === '#art-therapy') {
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
    }
  };

  return (
    <footer className={styles.footer} role="contentinfo" aria-label="Site Footer">
      <div className={styles.container}>
        <div className={styles.mainGrid}>
          {/* COLUMN 1: Project Astitva & Enactus Identity */}
          <div className={styles.brandColumn}>
            <div className={styles.identityBlock}>
              <h3 className={styles.brandTitle}>Project Astitva</h3>
              <p className={styles.brandTagline}>exist as you are.</p>
              <p className={styles.brandDescription}>
                An initiative by Enactus VIPS-TC creating space for conversation, support, and belonging.
              </p>
            </div>

            <div className={styles.enactusSubtle}>
              <span className={styles.enactusLabel}>A PROJECT BY</span>
              <div className={styles.enactusBrandRow}>
                <img
                  src={enactusLogo}
                  alt="Enactus Vivekananda Institute of Professional Studies - TC"
                  className={styles.enactusLogo}
                />
              </div>
            </div>
          </div>

          {/* COLUMN 2: Explore / Navigation */}
          <div className={styles.navColumn}>
            <h4 className={styles.columnHeading}>EXPLORE</h4>
            <ul className={styles.navList}>
              {NAV_LINKS.map((link) => (
                <li key={link.label} className={styles.navItem}>
                  <a
                    href={link.href}
                    className={styles.navLink}
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    <span className={styles.navLinkLine} aria-hidden="true" />
                    <span className={styles.navLinkLabel}>{link.label}</span>
                    <ArrowRight size={13} className={styles.navLinkArrow} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Connect with Us */}
          <div className={styles.connectColumn}>
            <h4 className={styles.columnHeading}>CONNECT</h4>
            <ul className={styles.connectList}>
              <li className={styles.connectItem}>
                <a
                  href="https://www.instagram.com/project_.astitva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.connectLink}
                  aria-label="Visit Project Astitva on Instagram"
                >
                  <div className={styles.connectIconWrapper}>
                    <Instagram size={15} className={styles.connectIcon} aria-hidden="true" />
                  </div>
                  <div className={styles.connectDetails}>
                    <span className={styles.connectTitle}>Instagram</span>
                    <span className={styles.connectValue}>@project_.astitva</span>
                  </div>
                </a>
              </li>

              <li className={styles.connectItem}>
                <a
                  href="https://www.linkedin.com/company/enactus-vips-tc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.connectLink}
                  aria-label="Visit Enactus VIPS-TC on LinkedIn"
                >
                  <div className={styles.connectIconWrapper}>
                    <Linkedin size={15} className={styles.connectIcon} aria-hidden="true" />
                  </div>
                  <div className={styles.connectDetails}>
                    <span className={styles.connectTitle}>LinkedIn</span>
                    <span className={styles.connectValue}>Enactus VIPS-TC</span>
                  </div>
                </a>
              </li>

              <li className={styles.connectItem}>
                <a
                  href="mailto:project.astitv@gmail.com"
                  className={styles.connectLink}
                  aria-label="Email Project Astitva at project.astitv@gmail.com"
                >
                  <div className={styles.connectIconWrapper}>
                    <Mail size={15} className={styles.connectIcon} aria-hidden="true" />
                  </div>
                  <div className={styles.connectDetails}>
                    <span className={styles.connectTitle}>Email</span>
                    <span className={styles.connectValue}>project.astitv@gmail.com</span>
                  </div>
                </a>
              </li>

              <li className={styles.connectItem}>
                <a
                  href="tel:+917982104063"
                  className={styles.connectLink}
                  aria-label="Call Project Astitva at +91 79821 04063"
                >
                  <div className={styles.connectIconWrapper}>
                    <Phone size={15} className={styles.connectIcon} aria-hidden="true" />
                  </div>
                  <div className={styles.connectDetails}>
                    <span className={styles.connectTitle}>Phone</span>
                    <span className={styles.connectValue}>+91 79821 04063</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider} aria-hidden="true" />

        {/* Bottom Row */}
        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            &copy; 2026 Project Astitva, Enactus VIPS-TC. All rights reserved.
          </p>
          <p className={styles.madeWithPurpose}>
            Made with purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
