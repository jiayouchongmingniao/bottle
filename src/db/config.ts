import mysql from 'mysql2/promise';

export const dbConfig = {
  host: process.env.DATABASE_HOST || '156.253.9.249',
  user: process.env.DATABASE_USER || 'pom',
  password: process.env.DATABASE_PASSWORD || 'chen7xia',
  database: process.env.DATABASE_NAME || 'mood_bottle',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool: mysql.Pool;

export async function getConnection() {
  if (!pool) {
    console.log('Creating new connection pool with config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });
    
    pool = mysql.createPool(dbConfig);
    
    // Test the connection
    try {
      const connection = await pool.getConnection();
      console.log('Successfully connected to database');
      connection.release();
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw error;
    }
  }
  
  return pool;
}
