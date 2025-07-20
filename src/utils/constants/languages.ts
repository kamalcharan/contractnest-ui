// src/utils/constants/languages.ts

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
}

export const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isRTL: false
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    isRTL: false
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    isRTL: false
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    isRTL: false
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    isRTL: false
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    isRTL: true
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    isRTL: false
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    isRTL: false
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    isRTL: false
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    isRTL: false
  }
];

// Get a language by code
export const getLanguageByCode = (code: string): Language | undefined => {
  return languages.find(lang => lang.code === code);
};

// Get default language (English)
export const getDefaultLanguage = (): Language => {
  return languages[0]; // English
};