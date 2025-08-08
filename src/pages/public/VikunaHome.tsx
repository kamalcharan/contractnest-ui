// src/pages/public/VikunaHome.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/vikuna/HeroSection';
import { ChallengesSection } from '@/components/vikuna/ChallengesSection';
import { LeadershipServices } from '@/components/vikuna/LeadershipServices';
import { KeyAreas } from '@/components/vikuna/KeyAreas';
import Industries from '@/components/vikuna/Industries';
import { ProfessionalNetwork } from '@/components/vikuna/ProfessionalNetwork';
import { CaseStudies } from '@/components/vikuna/CaseStudies';
import CTA from '@/components/vikuna/CTA';
import { ContactSection } from '@/components/vikuna/ContactSection';
import { Toaster } from '@/components/ui/toaster';
const VikunaHome = () => {
  useEffect(() => {
    // Set document title for SEO
    document.title = 'Vikuna Technologies - Digital Transformation Experts';
    
    // Create meta description for SEO
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Vikuna Technologies provides digital transformation and leadership services including CDO, CTO, and CAiO as a service to help businesses navigate their digital journey.');

    return () => {
      // No need to clean up as we're just updating an existing meta tag or adding one that can persist
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        <ChallengesSection />
        <LeadershipServices />
          
        <KeyAreas />
        <Industries />
        <ProfessionalNetwork />
        <CaseStudies />
        <CTA />
        <ContactSection />
        <Toaster />
      </motion.div>
    </div>
  );
};

export default VikunaHome;