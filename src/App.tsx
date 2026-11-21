import {useState} from 'react';
import {MotionConfig} from 'motion/react';
import {type ProjectCategory, type ProjectItem} from './data/agencyData';
import {ApplePointerCursor} from './components/ApplePointerCursor';
import {BrandLogoFilterDefs} from './components/BrandLogo';
import {Navbar} from './components/Navbar';
import {HeroSection} from './components/HeroSection';
import {WorkSection} from './components/WorkSection';
import {ProcessSection} from './components/ProcessSection';
import {WhyArcticSection} from './components/WhyArcticSection';
import {AboutSection} from './components/AboutSection';
import {TestimonialsSection} from './components/TestimonialsSection';
import {ContactSection} from './components/ContactSection';
import {Footer} from './components/Footer';
import {ProjectModal} from './components/ProjectModal';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background text-foreground">
        <ApplePointerCursor />
        <BrandLogoFilterDefs />
        <Navbar />

        <main>
          <HeroSection />
          <WorkSection
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onSelectProject={setSelectedProject}
          />
          <ProcessSection />
          <WhyArcticSection />
          <AboutSection />
          <TestimonialsSection />
          <ContactSection />
        </main>

        <Footer />

        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </MotionConfig>
  );
}
