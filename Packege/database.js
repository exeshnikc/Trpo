const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'polyclinic',
  password: '', // твой пароль PostgreSQL
  port: 5432,
});

const initDatabase = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Подключение к PostgreSQL успешно');
    
    // Таблица пользователей
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        login VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'patient',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Таблица врачей
    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        specialization VARCHAR(100) NOT NULL,
        room_number VARCHAR(10),
        birth_date DATE,
        district VARCHAR(50),
        health_group VARCHAR(50),
        address TEXT
      )
    `);

    // Таблица пациентов
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        birth_date DATE,
        phone VARCHAR(20),
        address TEXT,
        health_group VARCHAR(50),
        card_number VARCHAR(50),
        district VARCHAR(50),
        note TEXT
      )
    `);

    // Таблица талонов
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER REFERENCES patients(id),
        doctor_id INTEGER REFERENCES doctors(id),
        appointment_date DATE NOT NULL,
        ticket_number VARCHAR(20) UNIQUE,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Тестовый администратор
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT INTO users (login, password_hash, first_name, last_name, role) 
       VALUES ('admin', $1, 'Админ', 'Системный', 'admin') 
       ON CONFLICT (login) DO NOTHING`,
      [hashedPassword]
    );

    // Тестовые врачи
    await pool.query(`
      INSERT INTO doctors (first_name, last_name, specialization, room_number) VALUES 
      ('Иван', 'Петров', 'Терапевт', '101'),
      ('Мария', 'Сидорова', 'Хирург', '201'),
      ('Алексей', 'Козлов', 'Кардиолог', '301')
      ON CONFLICT DO NOTHING
    `);

    console.log('✅ База данных инициализирована');
  } catch (error) {
    console.log('❌ Ошибка БД:', error.message);
  }
};

module.exports = { pool, initDatabase };