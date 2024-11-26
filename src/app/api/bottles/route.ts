import { NextResponse } from 'next/server';
import { createBottle, getRandomBottle } from '@/db';
import { translateText, detectLanguage, supportedLanguages } from '@/services/translation';
import { getUserLocation, getClientIP } from '@/services/geolocation';
import { Bottle } from '@/types';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    
    // Detect the source language
    const sourceLanguage = await detectLanguage(content);
    console.log('Detected source language:', sourceLanguage);
    
    // Get user's location from IP
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const { country } = await getUserLocation(ip);
    
    // Translate the content to all supported languages
    console.log('Translating content to all supported languages...');
    const translations = await translateText(content, sourceLanguage);
    
    // Verify translations are complete
    const missingLanguages = supportedLanguages.filter(lang => !translations[lang]);
    if (missingLanguages.length > 0) {
      console.warn('Missing translations for languages:', missingLanguages);
      // Fill in missing translations with original content
      missingLanguages.forEach(lang => {
        translations[lang] = content;
      });
    }
    
    console.log('Translations completed:', Object.keys(translations).length, 'languages');
    
    // Create the bottle in the database
    const bottleId = await createBottle({
      content,
      translations,
      country,
      mood: 'neutral' // Default mood, can be updated based on content analysis
    });
    
    return NextResponse.json({ 
      success: true, 
      bottleId,
      translations 
    });
  } catch (error) {
    console.error('Error creating bottle:', error);
    return NextResponse.json(
      { error: 'Failed to create bottle' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('Getting random bottle from database...');
    const bottle = await getRandomBottle();
    
    if (!bottle) {
      console.log('No bottles found in database');
      return NextResponse.json(
        { error: 'No bottles found' },
        { status: 404 }
      );
    }
    
    // 验证bottle对象的完整性
    if (!bottle.translations || typeof bottle.translations !== 'object') {
      console.error('Invalid bottle data:', bottle);
      // 尝试重新翻译内容
      try {
        const sourceLanguage = await detectLanguage(bottle.content);
        bottle.translations = await translateText(bottle.content, sourceLanguage);
      } catch (translationError) {
        console.error('Failed to translate bottle content:', translationError);
        bottle.translations = {
          en: bottle.content,
          zh: bottle.content
        };
      }
    }

    // 确保translations包含所有支持的语言
    const missingLanguages = supportedLanguages.filter(
      lang => !bottle.translations[lang]
    );
    
    if (missingLanguages.length > 0) {
      console.log('Adding missing translations for languages:', missingLanguages);
      const sourceLanguage = await detectLanguage(bottle.content);
      const newTranslations = await translateText(bottle.content, sourceLanguage);
      
      bottle.translations = {
        ...bottle.translations,
        ...newTranslations
      };
    }
    
    console.log('Returning bottle:', {
      id: bottle.id,
      country: bottle.country,
      mood: bottle.mood,
      translationsCount: Object.keys(bottle.translations).length
    });
    
    return NextResponse.json(bottle);
  } catch (error) {
    console.error('Error getting random bottle:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get random bottle',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
