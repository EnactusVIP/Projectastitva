import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import ExpressionSketch from '../components/ExpressionSketch';
import foundation from './EditorialFoundation.module.css';
import styles from './ArtTherapy.module.css';

export default function ArtTherapy({ onNavigate }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const navigate = (event, page) => {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(page, page === 'home' ? '#home' : '#support');
  };

  return (
    <div className={foundation.surface}>
      <main className={styles.mainStage} aria-labelledby="art-therapy-title">
        <div className={styles.composition}>
          <div className={styles.content}>
            <p className={styles.eyebrow}>ART THERAPY</p>
            <h1 id="art-therapy-title" className={styles.title}>COMING SOON</h1>
            <p className={styles.tagline}>A new space for expression, reflection and creativity.</p>
            <p className={styles.description}>
              Something thoughtful is taking shape. Project Astitva’s planned Art Therapy initiative
              centres on expression, reflection and creativity — making room for the things we
              want to explore and express.
            </p>
            <div className={styles.actions}>
              <a href="#support" className={styles.primaryAction} onClick={event => navigate(event, 'support')}>
                Explore Support Services <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a href="#home" className={styles.homeLink} onClick={event => navigate(event, 'home')}>Return to Home</a>
            </div>
          </div>
          <figure className={styles.artwork}>
            <ExpressionSketch />
            <figcaption>Expression. Reflection. Creativity.</figcaption>
          </figure>
        </div>
      </main>
    </div>
  );
}
