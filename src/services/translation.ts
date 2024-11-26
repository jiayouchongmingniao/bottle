import axios from 'axios';
import { translate } from '@vitalets/google-translate-api';

export const supportedLanguages = ['en', 'zh', 'ar', 'bo', 'ja', 'ko', 'de', 'fr', 'es', 'ru', 'it'];

export const languageNames: Record<string, string> = {
  en: 'English',
  zh: 'Chinese',
  ar: 'Arabic',
  bo: 'Tibetan',
  ja: 'Japanese',
  ko: 'Korean',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  ru: 'Russian',
  it: 'Italian',
};

export async function detectLanguage(text: string): Promise<string> {
  try {
    const result = await translate(text, { to: 'en' });
    const detectedLanguage = result.raw.src || 'en';
    console.log('Detected language:', detectedLanguage);
    return supportedLanguages.includes(detectedLanguage) ? detectedLanguage : 'en';
  } catch (error) {
    console.error('Error detecting language:', error);
    // 检查文本是否包含中文字符
    if (/[\u4e00-\u9fa5]/.test(text)) {
      return 'zh';
    }
    return 'en'; // 默认使用英语
  }
}

export async function translateText(text: string, sourceLanguage: string): Promise<Record<string, string>> {
  const translations: Record<string, string> = {};
  translations[sourceLanguage] = text;

  try {
    // 使用Promise.all并行处理所有翻译请求
    const translationPromises = supportedLanguages
      .filter(lang => lang !== sourceLanguage)
      .map(async targetLang => {
        try {
          // 添加重试逻辑
          let retries = 3;
          let lastError;
          
          while (retries > 0) {
            try {
              const result = await translate(text, { 
                from: sourceLanguage, 
                to: targetLang 
              });
              return { lang: targetLang, text: result.text };
            } catch (error) {
              lastError = error;
              retries--;
              if (retries > 0) {
                // 等待一段时间后重试
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          }
          
          // 如果所有重试都失败了
          console.error(`Failed to translate to ${targetLang} after 3 attempts:`, lastError);
          return { lang: targetLang, text: text };
        } catch (error) {
          console.error(`Error translating to ${targetLang}:`, error);
          return { lang: targetLang, text: text };
        }
      });

    const results = await Promise.all(translationPromises);
    
    // 将结果添加到translations对象
    results.forEach(({ lang, text }) => {
      translations[lang] = text;
    });
    
    // 验证所有语言是否都有翻译
    const missingLanguages = supportedLanguages.filter(lang => !translations[lang]);
    if (missingLanguages.length > 0) {
      console.warn('Missing translations for languages:', missingLanguages);
      missingLanguages.forEach(lang => {
        translations[lang] = text;
      });
    }
  } catch (error) {
    console.error('Error in translation:', error);
    // 确保至少返回所有语言的原文
    supportedLanguages.forEach(lang => {
      if (!translations[lang]) {
        translations[lang] = text;
      }
    });
  }

  return translations;
}
