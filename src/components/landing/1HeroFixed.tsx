import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { saveContractNestLead } from '@/services/public-leads.service';

const HeroFixed: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Access theme context with fallback
  const themeContext = useTheme();
  const theme = themeContext?.theme || { mode: 'light' };
  const currentTheme = themeContext?.currentTheme;
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the service function instead of direct API
      await saveContractNestLead({
        email,
        source: 'hero_section'
      });
      
      // Clear the form and show success message
      setEmail('');
      toast({
        title: "Success!",
        description: "Thanks for your interest! We'll be in touch soon.",
        variant: "default",
      });
      
      // Track the submission
      if (window.gtag) {
        window.gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: 'hero_section',
        });
      }
      
    } catch (error) {
      console.error('Error submitting email:', error);
      toast({
        title: "Something went wrong",
        description: "Unable to submit your email. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="pt-24 pb-24 px-4 md:px-6 lg:px-8 relative overflow-hidden">
      {/* Background subtle pattern - visible in light mode only */}
      {theme.mode === 'light' && (
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ 
          backgroundImage: 'url(/assets/grid-pattern.svg)',
          backgroundSize: '20px 20px'
        }} />
      )}
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left side - Copy */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Untangle Your Commitments with ContractNest
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300">
              Setup Contracts, Service Plans, & Milestones. Focus on Building Relationships While We Handle Compliance.
            </p>
            
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto lg:mx-0 mb-8">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ 
                    backgroundColor: currentTheme?.colors?.brand?.primary || '#E53E3E',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? 'Signing up...' : 'Join Beta'}
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Get early access to our platform. No spam, ever.
              </p>
            </form>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Launching soon - Join our early beta program!</p>
            </div>
          </div>
          
          {/* Right side - Simple Image Solution */}
          <div className="flex-1">
            <div className="relative rounded-lg overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800">
              <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                {/* Placeholder dashboard image with fallback */}
                <div className="w-full h-full relative overflow-hidden">
                  <img 
                    src="/images/contract-management-hero.png" 
                    alt="Contract Management Dashboard" 
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Hide the broken image
                      target.style.display = 'none';
                      
                      // Instead of continuously trying to reload an image,
                      // we'll create a nice dashboard-like placeholder
                      const parentDiv = target.parentElement;
                      if (parentDiv) {
                        parentDiv.classList.add('flex', 'items-center', 'justify-center');
                        
                        // Create dashboard-like boxes as visual placeholder
                        const placeholder = document.createElement('div');
                        placeholder.className = 'w-4/5 grid grid-cols-2 gap-4';
                        placeholder.innerHTML = `
                          <div class="bg-white dark:bg-gray-700 h-32 rounded-lg shadow-sm"></div>
                          <div class="bg-white dark:bg-gray-700 h-32 rounded-lg shadow-sm"></div>
                          <div class="bg-white dark:bg-gray-700 h-32 rounded-lg shadow-sm"></div>
                          <div class="bg-white dark:bg-gray-700 h-32 rounded-lg shadow-sm"></div>
                        `;
                        
                        parentDiv.appendChild(placeholder);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Industry segments instead of logos */}
        <div className="mt-20 text-center">
          <div className="mb-6">
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              For Everyone Managing Service Commitments
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              ContractNest serves diverse industries with tailored contract management solutions
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {/* Industry segments with icons */}
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-medium text-gray-800 dark:text-gray-200">OEM/Manufacturing</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="font-medium text-gray-800 dark:text-gray-200">Healthcare</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="font-medium text-gray-800 dark:text-gray-200">Pharma</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-gray-800 dark:text-gray-200">Service Agencies</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-gray-800 dark:text-gray-200">Business</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30 hover:shadow-md transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium text-red-800 dark:text-red-200">You</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroFixed;