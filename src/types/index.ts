export interface Bottle {
  id: string;
  content: string;
  translations: {
    en: string;
    zh: string;
    ar: string;
    bo: string; // Tibetan
    ja: string;
    ko: string;
    de: string;
    fr: string;
    es: string;
    ru: string;
    it: string;
  };
  country: string;
  timestamp: string;
  mood: 'positive' | 'neutral' | 'encouraging';
}

export interface User {
  ip: string;
  country: string;
  language: string;
}

export type SupportedLanguage = 
  | 'en' // English
  | 'zh' // Chinese
  | 'ar' // Arabic
  | 'bo' // Tibetan
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'de' // German
  | 'fr' // French
  | 'es' // Spanish
  | 'ru' // Russian
  | 'it'; // Italian

export interface PresetMood {
  id: string;
  type: 'positive' | 'neutral' | 'encouraging';
  content: Record<SupportedLanguage, string>;
}
