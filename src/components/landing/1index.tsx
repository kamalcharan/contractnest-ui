// src/components/Landing/index.tsx
import Hero from './Hero';
import ProblemStatement from './ProblemStatement';
import HowItWorks from './HowItWorks';
import PersonaSection from './PersonaSection';
import FeatureHighlights from './FeatureHighlights';
import AISection from './AISection';
import EmailCapture from './EmailCapture';
import Footer from './Footer';

export {
  Hero,
  ProblemStatement,
  HowItWorks,
  PersonaSection,
  FeatureHighlights,
  AISection,
  EmailCapture,
  Footer
};

// Main component for direct import
const Landing = () => (
  <>
    <Hero />
    <ProblemStatement />
    <HowItWorks />
    <PersonaSection />
    <FeatureHighlights />
    <AISection />
    <EmailCapture />
    <Footer />
  </>
);

export default Landing;