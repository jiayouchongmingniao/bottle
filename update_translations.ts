import { getConnection } from './src/db/config';
import { translateText, detectLanguage } from './src/services/translation';

async function updateTranslations() {
  try {
    const connection = await getConnection();
    console.log('Database connection established successfully');
    
    // 获取所有记录
    const [rows] = await connection.query(
      "SELECT id, content, translations FROM bottles"
    );
    
    console.log(`Found ${(rows as any[]).length} total records`);
    
    for (const row of rows as any[]) {
      try {
        let translations;
        try {
          translations = JSON.parse(row.translations);
        } catch (e) {
          translations = {};
        }

        // 检查是否需要更新翻译
        if (!translations || Object.keys(translations).length === 0 || 
            !translations.en || translations.en === "") {
          console.log(`Updating translations for content: ${row.content}`);
          
          // 检测语言
          const sourceLanguage = await detectLanguage(row.content);
          console.log(`Detected language: ${sourceLanguage}`);
          
          // 获取翻译
          const newTranslations = await translateText(row.content, sourceLanguage);
          console.log('Got translations:', newTranslations);
          
          // 更新数据库
          await connection.execute(
            'UPDATE bottles SET translations = ? WHERE id = ?',
            [JSON.stringify(newTranslations), row.id]
          );
          
          console.log(`Updated translations for ID: ${row.id}`);
        } else {
          console.log(`Skipping ID ${row.id} - already has translations`);
        }
      } catch (error) {
        console.error(`Error updating translations for ID ${row.id}:`, error);
      }
    }
    
    console.log('Finished updating translations');
    connection.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

updateTranslations();
