/// <reference types="vite/client" />

declare global {
  interface Window {
    gtag: any;
    dataLayer: any[];
    contractNestAnalytics: any;
  }
  const gtag: any;
  const dataLayer: any[];
}

type Channel = any;

export {};