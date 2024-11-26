CREATE DATABASE IF NOT EXISTS mood_bottle;

USE mood_bottle;

CREATE TABLE IF NOT EXISTS bottles (
  id VARCHAR(36) PRIMARY KEY,
  content TEXT NOT NULL,
  translations JSON NOT NULL,
  country VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  mood ENUM('positive', 'neutral', 'encouraging')
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS preset_moods (
  id VARCHAR(36) PRIMARY KEY,
  type ENUM('positive', 'neutral', 'encouraging'),
  content JSON NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
