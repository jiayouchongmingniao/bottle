import axios from 'axios';
import { SupportedLanguage } from '../types';

interface GeolocationResponse {
  country: string;
  country_code: string;
  languages: string[];
}

const languageMapping: Record<string, SupportedLanguage> = {
  'en': 'en',
  'zh': 'zh',
  'ar': 'ar',
  'bo': 'bo',
  'ja': 'ja',
  'ko': 'ko',
  'de': 'de',
  'fr': 'fr',
  'es': 'es',
  'ru': 'ru',
  'it': 'it'
};

export async function getUserLocation(ip: string): Promise<{
  country: string;
  language: SupportedLanguage;
}> {
  try {
    // Using ipapi.co for geolocation (free tier available)
    const response = await axios.get<GeolocationResponse>(
      `https://ipapi.co/${ip}/json/`
    );

    const defaultLanguage: SupportedLanguage = 'en';
    let detectedLanguage = defaultLanguage;

    // Find the first supported language from the user's language list
    for (const lang of response.data.languages.split(',')) {
      const code = lang.split('-')[0].toLowerCase();
      if (code in languageMapping) {
        detectedLanguage = languageMapping[code];
        break;
      }
    }

    return {
      country: response.data.country,
      language: detectedLanguage
    };
  } catch (error) {
    console.error('Geolocation error:', error);
    return {
      country: 'Unknown',
      language: 'en'
    };
  }
}

// For development/testing, you can use this function to get the client's IP
export function getClientIP(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded 
    ? forwarded.split(/, /)[0]
    : req.connection.remoteAddress;
    
  return ip.replace('::ffff:', ''); // Remove IPv6 prefix if present
}
