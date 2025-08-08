import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { saveContractNestLead } from '@/services/public-leads.service';

const EmailCapture: React.FC = () => {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Access theme context with fallback
  const themeContext = useTheme();
  const theme = themeContext?.theme || { mode: 'light' };
  const currentTheme = themeContext?.currentTheme;
  
  // Theme-specific styling
  const sectionBg = theme.mode === 'dark' ? 'bg-black' : 'bg-white';
  const textColor = theme.mode === 'dark' ? 'text-white' : 'text-black';
  const secondaryTextColor = theme.mode === 'dark' ? 'text-gray-300' : 'text-gray-600';
  
  const handleSubmit = async (e: React.FormEvent) => {
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
      // Use the new saveContractNestLead service function
      await saveContractNestLead({
        email,
        company_name: companyName || null,
        source: 'cta_section'
      });
      
      // Clear the form and show success message
      setEmail('');
      setCompanyName('');
      toast({
        title: "Success!",
        description: "You're on the early access list! We'll be in touch soon.",
        variant: "default",
      });
      
      // Track the submission (keeping this for backward compatibility)
      if (window.gtag) {
        window.gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: 'cta_section',
        });
      }
      
    } catch (error) {
      console.error('Error submitting email:', error);
      toast({
        title: "Something went wrong",
        description: "Unable to submit your information. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={`py-20 px-4 md:px-6 lg:px-8 ${sectionBg}`} id="email-signup">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - copy */}
          <div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>
              Be Our Adaptor in Digital Transformation
            </h2>
            <p className={`text-lg mb-6 ${secondaryTextColor}`}>
              Join our early access program and be among the first to experience ContractNest. We're looking for forward-thinking businesses to help shape the future of contract management.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${textColor}`}>Priority Access</h3>
                  <p className={secondaryTextColor}>Be first in line when we launch and get exclusive early features.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${textColor}`}>Founding Member Pricing</h3>
                  <p className={secondaryTextColor}>Lock in special pricing that will be grandfathered as we scale.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${textColor}`}>Direct Input</h3>
                  <p className={secondaryTextColor}>Shape the future of ContractNest with your feedback and feature requests.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - form */}
          <div>
            <div 
              className="rounded-xl border p-8"
              style={{ 
                borderColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
              }}
            >
              <h3 className={`text-2xl font-bold mb-6 ${textColor}`}>Join the Waitlist</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="companyName" className={`block mb-2 text-sm font-medium ${textColor}`}>
                    Company Name
                  </label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className={`block mb-2 text-sm font-medium ${textColor}`}>
                    Business Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="w-full"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  style={{ 
                    backgroundColor: currentTheme?.colors?.brand?.primary || '#E53E3E',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? 'Processing...' : 'Request Early Access'}
                </Button>
                
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                  We'll keep you updated on our launch progress.
                </p>
              </form>
            </div>
            
            {/* Social proof */}
            <div className="mt-8 text-center">
              <p className={`text-sm font-medium mb-4 ${secondaryTextColor}`}>
                
              </p> 
              
              <div className="flex flex-wrap justify-center gap-6 items-center opacity-60">
                {/* Placeholder for company logos */}
                <div className="h-6 w-20 bg-red-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-blue-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-green-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 100% OpEx banner */}
        <div className="mt-20 text-center">
          <div className="inline-block rounded-full px-4 py-1 text-sm font-medium mb-3" style={{ 
            backgroundColor: theme.mode === 'dark' ? 'rgba(229, 62, 62, 0.1)' : 'rgba(229, 62, 62, 0.05)',
            color: currentTheme?.colors?.brand?.primary || '#E53E3E'
          }}>
            100% OpEx
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>
            Pay only for what you use. It costs less than a coffee for each contract
          </h3>
          <p className={secondaryTextColor}>No upfront charges, just simple usage-based pricing.</p>
        </div>
      </div>
    </section>
  );
};

export default EmailCapture;