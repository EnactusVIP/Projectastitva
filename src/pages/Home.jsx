import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AstitvaIntro from '../components/AstitvaIntro'
import ProjectOverview from '../components/ProjectOverview'
import ImpactSection from '../components/ImpactSection'
import HomeCTA from '../components/HomeCTA'
import Footer from '../components/Footer'
import SaathiFloatingLauncher from '../components/SaathiFloatingLauncher'

export default function Home({ onNavigate, showNavbar = false, showFooter = false }) {
  return (
    <>
      {showNavbar && <Navbar activePage="home" onNavigate={onNavigate} />}
      <main>
        <Hero onNavigate={onNavigate} />
        <AstitvaIntro />
        <ProjectOverview onNavigate={onNavigate} />
        <ImpactSection onNavigate={onNavigate} />
        <HomeCTA onNavigate={onNavigate} />
      </main>
      <SaathiFloatingLauncher />
      {showFooter && <Footer onNavigate={onNavigate} />}
    </>
  )
}
