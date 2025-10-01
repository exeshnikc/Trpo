const { Pool } = require('pg');

console.log('🔍 Проверяем подключение к PostgreSQL...');

// Настройки подключения
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'polyclinic',
  password: '123456', // ЕСЛИ НЕТ ПАРОЛЯ - СДЕЛАЙ password: ''
  port: 5432,
});

async function testConnection() {
  try {
    // 1. Проверяем подключение
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Подключение к PostgreSQL успешно');
    console.log('   Текущее время в БД:', result.rows[0].current_time);
    
    // 2. Проверяем какие таблицы есть
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📊 Таблицы в базе:');
    if (tables.rows.length === 0) {
      console.log('   ❌ Таблиц нет');
    } else {
      tables.rows.forEach(row => {
        console.log('   ✅', row.table_name);
      });
    }
    
  } catch (error) {
    console.log('❌ Ошибка подключения:');
    console.log('   Сообщение:', error.message);
    
    // Подсказки по ошибкам
    if (error.message.includes('password authentication failed')) {
      console.log('   💡 Неправильный пароль! Проверь пароль в файле test-db.js');
    } else if (error.message.includes('database "polyclinic" does not exist')) {
      console.log('   💡 База "polyclinic" не существует! Создай её: createdb polyclinic');
    } else if (error.message.includes('connection refused')) {
      console.log('   💡 PostgreSQL не запущен! Запусти: brew services start postgresql');
    }
  } finally {
    await pool.end();
    console.log('🔗 Проверка завершена');
  }
}

// Запускаем проверку
testConnection();