import { config } from 'dotenv';
import { resolve } from 'path';
import { getConnection } from '../src/db/config';
import { detectLanguage, translateText } from '../src/services/translation';

// 加载环境变量
config({ path: resolve(__dirname, '../.env.local') });

function containsChinese(text: string): boolean {
  return /[\u4E00-\u9FFF]/.test(text);
}

async function updateTranslations() {
  let connection;
  try {
    // 获取数据库连接
    connection = await getConnection();
    
    // 获取所有漂流瓶
    const [bottles] = await connection.query('SELECT id, content FROM bottles');
    
    console.log(`Found ${(bottles as any[]).length} bottles to translate`);
    
    for (const bottle of bottles as any[]) {
      try {
        console.log(`\nProcessing bottle ID: ${bottle.id}`);
        console.log(`Content: ${bottle.content}`);
        
        // 如果内容包含中文，则设置源语言为中文
        const sourceLanguage = containsChinese(bottle.content) ? 'zh' : 'en';
        console.log(`Source language: ${sourceLanguage}`);
        
        // 获取翻译
        const translations = await translateText(bottle.content, sourceLanguage);
        console.log('Translations:', translations);
        
        // 更新数据库
        await connection.query(
          'UPDATE bottles SET translations = ?, source_language = ? WHERE id = ?',
          [JSON.stringify(translations), sourceLanguage, bottle.id]
        );
        
        console.log(`Successfully updated translations for bottle ID: ${bottle.id}`);
        
        // 添加小延迟以避免过快请求
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing bottle ID ${bottle.id}:`, error);
        continue; // 继续处理下一个漂流瓶
      }
    }
    
    console.log('\nTranslation update completed');
  } catch (error) {
    console.error('Error during translation update:', error);
  } finally {
    if (connection) {
      const pool = await getConnection();
      await pool.end();
    }
  }
}

updateTranslations().catch(console.error);
