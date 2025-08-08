// src/utils/data/structured-data.constants.ts
import { FAQItem, BreadcrumbItem, LocalBusinessData } from '../../types/seo.types';

export const STRUCTURED_DATA_CONSTANTS = {
  // Organization Schema
  ORGANIZATION: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ContractNest",
    "description": "Digital service contract exchange platform for automating service agreements, compliance tracking, and partner collaboration",
    "url": "https://contractnest.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://contractnest.com/images/logo.png",
      "width": 300,
      "height": 100
    },
    "image": "https://contractnest.com/images/og-image.jpg",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "Charan Kamal B",
      "jobTitle": "Founder & CEO",
      "email": "charan@contractnest.com"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9949701175",
      "contactType": "customer service",
      "email": "charan@contractnest.com",
      "availableLanguage": ["English", "Hindi"],
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://linkedin.com/company/contractnest",
      "https://twitter.com/contractnest"
    ],
    "knowsAbout": [
      "Service Contract Management",
      "Digital Contract Automation",
      "SLA Compliance Tracking",
      "Invoice Automation",
      "Partner Collaboration"
    ]
  },

  // Website Schema
  WEBSITE: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ContractNest",
    "description": "Service Contract Exchange Platform",
    "url": "https://contractnest.com",
    "inLanguage": "en-IN",
    "copyrightYear": new Date().getFullYear(),
    "creator": {
      "@type": "Organization",
      "name": "ContractNest"
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://contractnest.com/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    ]
  },

  // Software Application Schema
  SOFTWARE_APPLICATION: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ContractNest",
    "description": "Digital service contract management platform for automating service agreements, compliance tracking, and partner collaboration",
    "url": "https://contractnest.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "author": {
      "@type": "Organization",
      "name": "ContractNest"
    },
    "offers": {
      "@type": "Offer",
      "price": "250",
      "priceCurrency": "INR",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "250",
        "priceCurrency": "INR",
        "billingIncrement": "contract"
      },
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Service Contract Automation",
      "SLA Compliance Tracking", 
      "Automated Invoice Generation",
      "Partner Collaboration Platform",
      "Performance Analytics Dashboard",
      "Multi-industry Templates",
      "Mobile Access",
      "Payment Gateway Integration"
    ],
    "screenshot": "https://contractnest.com/images/app-screenshot.jpg",
    "softwareHelp": "https://contractnest.com/help",
    "downloadUrl": "https://contractnest.com/signup",
    "installUrl": "https://contractnest.com/signup"
  },

  // FAQ Schema Data
  FAQS: [
    {
      question: "What is ContractNest and how does it work?",
      answer: "ContractNest is a service contract exchange platform that digitizes and automates service agreements. You create contracts, invite partners, and the platform handles automation, compliance tracking, and invoicing automatically. It works in 4 simple steps: Create service contracts, Invite partners who join automatically, Automate reminders and compliance, Scale with analytics and insights."
    },
    {
      question: "How much does ContractNest cost?",
      answer: "ContractNest uses contract-based pricing at ₹250 per contract with no user limits. It's a 100% OpEx model with minimum 10 contracts, making it affordable for businesses of all sizes. Unlike traditional software that charges per user, you only pay for the contracts you manage."
    },
    {
      question: "Which industries can use ContractNest?",
      answer: "ContractNest serves healthcare, manufacturing, HVAC, consulting, and any industry with recurring service commitments. We provide specialized templates and compliance features for each sector including equipment maintenance, calibration contracts, lease agreements, and professional services."
    },
    {
      question: "How quickly can I set up service contracts?",
      answer: "You can create your first service contract in under 5 minutes using our automated templates. Partners join automatically when they accept contracts, creating instant network effects. The platform includes pre-built templates for maintenance contracts, consulting agreements, lease contracts, and more."
    },
    {
      question: "Does ContractNest handle compliance and SLA tracking?",
      answer: "Yes, ContractNest automatically tracks SLA compliance, sends proactive reminders, generates compliance reports, and ensures you never miss regulatory deadlines or service commitments. It includes automated alerts for upcoming events, payment due dates, and compliance requirements."
    },
    {
      question: "Can partners and vendors collaborate on contracts?",
      answer: "Absolutely. ContractNest creates a collaborative environment where all stakeholders can view contracts, update statuses, and communicate within the platform. This eliminates email chains and confusion while providing complete visibility into service delivery."
    },
    {
      question: "Is there a mobile app for ContractNest?",
      answer: "Yes, ContractNest includes mobile access for field teams and partners to update contract statuses, view schedules, and manage tasks on the go. The mobile interface is optimized for quick updates and real-time collaboration."
    },
    {
      question: "How does automated invoicing work?",
      answer: "ContractNest automatically generates invoices based on contract milestones, recurring schedules, or completion events. Integration with payment gateways enables faster collections and better cash flow. You can customize invoice templates and automate payment reminders."
    },
    {
      question: "What makes ContractNest different from other contract management tools?",
      answer: "ContractNest is positioned as a Service Contract Exchange rather than traditional SaaS. Anyone can create contracts regardless of buyer/seller role, partners join through network effects, and it focuses specifically on service agreements with automation, compliance, and collaboration built-in."
    },
    {
      question: "How secure is my contract data on ContractNest?",
      answer: "ContractNest follows enterprise-grade security standards including data encryption, secure access controls, regular backups, and compliance with data protection regulations. All sensitive contract information is protected with bank-level security measures."
    }
  ] as FAQItem[],

  // How-To Schema for Setup Process
  HOW_TO_SETUP: {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Set Up Service Contract Management with ContractNest",
    "description": "Step-by-step guide to digitize your service contracts and automate compliance tracking with ContractNest platform",
    "image": "https://contractnest.com/images/how-to-setup.jpg",
    "totalTime": "PT10M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": "250"
    },
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Web Browser"
      },
      {
        "@type": "HowToTool", 
        "name": "Email Address"
      },
      {
        "@type": "HowToTool",
        "name": "Service Contract Details"
      }
    ],
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Service Agreement Information"
      },
      {
        "@type": "HowToSupply",
        "name": "Partner Contact Details"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Create Service Contract",
        "text": "Log into ContractNest and create your first service contract using automated templates for maintenance, consulting, lease, or custom arrangements",
        "image": "https://contractnest.com/images/step1-create-contract.jpg",
        "url": "https://contractnest.com/how-it-works#create"
      },
      {
        "@type": "HowToStep",
        "name": "Invite Partners",
        "text": "Share contract with clients, vendors, or team members. They join automatically when they accept, creating network effects",
        "image": "https://contractnest.com/images/step2-invite-partners.jpg", 
        "url": "https://contractnest.com/how-it-works#collaborate"
      },
      {
        "@type": "HowToStep",
        "name": "Automate Everything",
        "text": "Set up automated reminders, invoicing, compliance tracking, and SLA monitoring. The platform handles routine tasks automatically",
        "image": "https://contractnest.com/images/step3-automate.jpg",
        "url": "https://contractnest.com/how-it-works#automate"
      },
      {
        "@type": "HowToStep",
        "name": "Scale & Optimize",
        "text": "Use analytics dashboard to optimize performance, track KPIs, and expand your service relationships with data-driven insights",
        "image": "https://contractnest.com/images/step4-scale.jpg",
        "url": "https://contractnest.com/how-it-works#scale"
      }
    ]
  },

  // Breadcrumb Collections
  BREADCRUMBS: {
    HOME: [
      { name: "Home", url: "https://contractnest.com" }
    ] as BreadcrumbItem[],
    
    FEATURES: [
      { name: "Home", url: "https://contractnest.com" },
      { name: "Features", url: "https://contractnest.com/features" }
    ] as BreadcrumbItem[],
    
    INDUSTRIES: [
      { name: "Home", url: "https://contractnest.com" },
      { name: "Industries", url: "https://contractnest.com/industries" }
    ] as BreadcrumbItem[],
    
    HEALTHCARE: [
      { name: "Home", url: "https://contractnest.com" },
      { name: "Industries", url: "https://contractnest.com/industries" },
      { name: "Healthcare", url: "https://contractnest.com/industries/healthcare" }
    ] as BreadcrumbItem[],
    
    MANUFACTURING: [
      { name: "Home", url: "https://contractnest.com" },
      { name: "Industries", url: "https://contractnest.com/industries" },
      { name: "Manufacturing", url: "https://contractnest.com/industries/manufacturing" }
    ] as BreadcrumbItem[],
    
    HVAC: [
      { name: "Home", url: "https://contractnest.com" },
      { name: "Industries", url: "https://contractnest.com/industries" },
      { name: "HVAC", url: "https://contractnest.com/industries/hvac" }
    ] as BreadcrumbItem[],
    
    CONSULTING: [
      { name: "Home", url: "https://contractnest.com" },
      { name: "Industries", url: "https://contractnest.com/industries" },
      { name: "Consulting", url: "https://contractnest.com/industries/consulting" }
    ] as BreadcrumbItem[],
    
    PRICING: [
      { name: "Home", url: "https://contractnest.com" },
      { name: "Pricing", url: "https://contractnest.com/pricing" }
    ] as BreadcrumbItem[],
    
    HOW_IT_WORKS: [
      { name: "Home", url: "https://contractnest.com" },
      { name: "How it Works", url: "https://contractnest.com/how-it-works" }
    ] as BreadcrumbItem[]
  },

  // Local Business Data
  LOCAL_BUSINESS: {
    name: "ContractNest",
    address: {
      streetAddress: "Hyderabad",
      addressLocality: "Hyderabad", 
      addressRegion: "Telangana",
      postalCode: "500001",
      addressCountry: "IN"
    },
    telephone: "+91-9949701175",
    email: "charan@contractnest.com",
    url: "https://contractnest.com",
    priceRange: "₹₹",
    openingHours: [
      "Mo-Fr 09:00-18:00"
    ]
  } as LocalBusinessData,

  // Service Schemas by Industry
  SERVICES: {
    HEALTHCARE: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Healthcare Contract Management",
      "description": "Specialized service contract management for healthcare organizations including equipment maintenance, biomedical services, and compliance tracking",
      "provider": {
        "@type": "Organization",
        "name": "ContractNest"
      },
      "areaServed": "India",
      "serviceType": "Healthcare Contract Management Software",
      "category": "Healthcare Technology"
    },
    
    MANUFACTURING: {
      "@context": "https://schema.org", 
      "@type": "Service",
      "name": "Manufacturing Service Contract Management",
      "description": "Digital contract management for manufacturing and OEM companies including equipment maintenance, calibration, and partner management",
      "provider": {
        "@type": "Organization",
        "name": "ContractNest"
      },
      "areaServed": "India",
      "serviceType": "Manufacturing Contract Management Software",
      "category": "Manufacturing Technology"
    },
    
    HVAC: {
      "@context": "https://schema.org",
      "@type": "Service", 
      "name": "HVAC Service Contract Management",
      "description": "Automated contract management for HVAC service providers including maintenance scheduling, SLA tracking, and customer management",
      "provider": {
        "@type": "Organization",
        "name": "ContractNest"
      },
      "areaServed": "India",
      "serviceType": "HVAC Contract Management Software",
      "category": "HVAC Technology"
    }
  }
};

// Helper function to generate FAQ schema
export const generateFAQSchema = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

// Helper function to generate breadcrumb schema
export const generateBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});