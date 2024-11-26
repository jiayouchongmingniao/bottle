import { v4 as uuidv4 } from 'uuid';
import { Bottle, PresetMood } from '../types';
import { getConnection } from './config';
import path from 'path';
import { promises as fs } from 'fs';

let db: any = null;

export async function initializeDatabase() {
  if (!db) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT 1');
    db = rows;
  }
  return db;
}

export async function createBottle(bottle: Omit<Bottle, 'id' | 'timestamp'>) {
  const connection = await getConnection();
  const id = uuidv4();
  
  await connection.execute(
    `INSERT INTO bottles (id, content, translations, country, mood)
     VALUES (?, ?, ?, ?, ?)`,
    [
      id,
      bottle.content,
      JSON.stringify(bottle.translations),
      bottle.country,
      bottle.mood
    ]
  );

  return id;
}

export async function getRandomBottle(): Promise<Bottle | null> {
  const connection = await getConnection();
  console.log('Getting random bottle from database...');
  
  try {
    const [rows] = await connection.query(
      'SELECT * FROM bottles ORDER BY RAND() LIMIT 1'
    );

    if (!rows || (rows as any[]).length === 0) {
      console.log('No bottles found in database');
      return null;
    }

    const bottle = (rows as any[])[0];
    
    // 安全地处理translations字段
    let translations = {};
    try {
      if (bottle.translations) {
        if (typeof bottle.translations === 'string') {
          translations = JSON.parse(bottle.translations);
        } else if (typeof bottle.translations === 'object') {
          translations = bottle.translations;
        }
      }
    } catch (error) {
      console.error('Error parsing translations:', error);
      translations = { en: bottle.content }; // 使用原始内容作为英文翻译
    }

    return {
      id: bottle.id,
      content: bottle.content,
      translations: translations,
      country: bottle.country,
      mood: bottle.mood,
      timestamp: bottle.timestamp
    };
  } catch (error) {
    console.error('Error fetching random bottle:', error);
    throw error;
  }
}

export async function getPresetMoods(type: Bottle['mood']): Promise<PresetMood[]> {
  const connection = await getConnection();
  
  const [rows] = await connection.query(
    'SELECT * FROM preset_moods WHERE type = ?',
    [type]
  );

  return (rows as any[]).map(mood => ({
    ...mood,
    content: JSON.parse(mood.content)
  }));
}

export async function addPresetMood(mood: Omit<PresetMood, 'id'>) {
  const connection = await getConnection();
  const id = uuidv4();

  await connection.execute(
    `INSERT INTO preset_moods (id, type, content)
     VALUES (?, ?, ?)`,
    [
      id,
      mood.type,
      JSON.stringify(mood.content)
    ]
  );

  return id;
}
