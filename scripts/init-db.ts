import * as dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { promises as fs } from 'fs';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function initializeDatabase() {
  try {
    const dbConfig = {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    console.log('Database configuration:', {
      host: dbConfig.host,
      user: dbConfig.user
    });

    // Create initial connection pool without database
    const pool = mysql.createPool(dbConfig);

    // Create database if it doesn't exist
    await pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME}`);
    console.log('Database created or already exists');

    // Switch to the database
    await pool.query(`USE ${process.env.DATABASE_NAME}`);
    console.log('Switched to database:', process.env.DATABASE_NAME);

    // Read the SQL file
    const sqlContent = await fs.readFile(
      path.join(process.cwd(), 'src', 'db', 'init.sql'),
      'utf-8'
    );

    // Split the SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .filter(statement => statement.trim().length > 0);

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
        console.log('Executed SQL statement successfully');
      }
    }

    console.log('Database initialization completed successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
