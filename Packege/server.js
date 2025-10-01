const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'polyclinic-secret-key-2025';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Инициализация базы данных
const db = new sqlite3.Database('./polyclinic.db');

// Функция для инициализации базы данных
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Пользователи
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'patient',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Новости для квадратиков как на скриншоте
      db.run(`CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        title TEXT NOT NULL,
        short_description TEXT,
        full_description TEXT,
        image_url TEXT,
        category TEXT DEFAULT 'general',
        is_active BOOLEAN DEFAULT 1,
        display_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          console.error('❌ Ошибка создания таблицы news:', err);
          reject(err);
          return;
        }
        console.log('✅ Таблица news создана/проверена');

        // Очищаем старые данные и добавляем новые новости как на скриншоте
        db.run('DELETE FROM news', (err) => {
          if (err) {
            console.error('❌ Ошибка очистки таблицы news:', err);
            reject(err);
            return;
          }
          console.log('✅ Старые новости удалены');
          
          // Добавляем точные новости как на скриншоте
          const newsItems = [
            ['01 октября 2025', 'Открыт новый кабинет кардиолога', 'Открыт новый кабинет кардиолога.', 'В поликлинике открылся новый современный кабинет кардиологии, оснащенный самым современным оборудованием для диагностики и лечения сердечно-сосудистых заболеваний.', 'cardio.jpg', 'equipment', 1],
            ['05 октября 2025', 'Начинается вакцинация против гриппа', 'Начинается вакцинация против гриппа.', 'С 5 октября начинается сезонная вакцинация против гриппа. Запись открыта для всех возрастных групп в порядке живой очереди.', 'vaccine.jpg', 'vaccination', 2],
            ['07 октября 2025', 'Изменено расписание приёма терапевтов', 'Изменено расписание приёма терапевтов.', 'Внимание! С 7 октября изменяется расписание приема терапевтов. Уточняйте время приема у администратора.', 'schedule.jpg', 'schedule', 3],
            ['10 октября 2025', 'Приём нового эндокринолога', 'Приём нового эндокринолога.', 'В нашу команду присоединился опытный врач-эндокринолог. Запись на прием открыта через регистратуру.', 'endocrinologist.jpg', 'doctors', 4],
            ['15 октября 2025', 'Неделя диабетической консультации', 'Неделя диабетической консультации.', 'С 15 по 22 октября проводится неделя бесплатных консультаций для пациентов с сахарным диабетом.', 'diabetes.jpg', 'events', 5]
          ];

          const stmt = db.prepare(`INSERT INTO news (date, title, short_description, full_description, image_url, category, display_order) 
                                  VALUES (?, ?, ?, ?, ?, ?, ?)`);
          
          let insertedCount = 0;
          newsItems.forEach((news, index) => {
            stmt.run(news, (err) => {
              if (err) {
                console.error('❌ Ошибка при добавлении новости:', err);
              } else {
                insertedCount++;
                console.log(`✅ Добавлена новость: ${news[1]}`);
              }
              
              // Если это последняя новость, завершаем подготовленное выражение
              if (index === newsItems.length - 1) {
                setTimeout(() => {
                  stmt.finalize();
                  console.log(`✅ Все новости добавлены в базу данных (${insertedCount}/${newsItems.length})`);
                  resolve();
                }, 100);
              }
            });
          });
        });
      });

      // Добавляем тестового пользователя
      const hashedPassword = bcrypt.hashSync('password123', 10);
      db.run(`INSERT OR IGNORE INTO users (first_name, last_name, email, phone, password) 
              VALUES (?, ?, ?, ?, ?)`, 
              ['Ама', 'Сычова', 'amasyhova23@yandex.by', '445122279', hashedPassword],
              (err) => {
                if (err) {
                  console.error('❌ Ошибка добавления пользователя:', err);
                } else {
                  console.log('✅ Тестовый пользователь добавлен');
                }
              });
    });
  });
}

// ==================== API РОУТЫ ДЛЯ НОВОСТЕЙ ====================

// 1. Получение всех активных новостей для квадратиков
app.get('/api/news', (req, res) => {
  const { limit = 5 } = req.query;
  
  const query = `
    SELECT id, date, title, short_description, image_url, category
    FROM news 
    WHERE is_active = 1 
    ORDER BY display_order ASC, date DESC 
    LIMIT ?
  `;

  console.log('📥 Запрос новостей из БД');

  db.all(query, [parseInt(limit)], (err, rows) => {
    if (err) {
      console.error('❌ Ошибка базы данных:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка получения новостей из базы данных' 
      });
    }
    
    console.log(`✅ Получено ${rows.length} новостей из БД`);
    
    res.json({
      success: true,
      news: rows,
      total: rows.length
    });
  });
});

// 2. Получение одной новости по ID
app.get('/api/news/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM news WHERE id = ? AND is_active = 1', [id], (err, row) => {
    if (err) {
      console.error('❌ Ошибка базы данных:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка получения новости' 
      });
    }
    
    if (!row) {
      return res.status(404).json({ 
        success: false,
        error: 'Новость не найдена' 
      });
    }
    
    res.json({
      success: true,
      news: row
    });
  });
});

// 3. Добавление новой новости
app.post('/api/news', (req, res) => {
  const { date, title, short_description, full_description, image_url, category } = req.body;

  if (!date || !title) {
    return res.status(400).json({ 
      success: false,
      error: 'Дата и заголовок обязательны' 
    });
  }

  db.run(
    `INSERT INTO news (date, title, short_description, full_description, image_url, category) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [date, title, short_description, full_description, image_url, category],
    function(err) {
      if (err) {
        console.error('❌ Ошибка базы данных:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Ошибка при добавлении новости' 
        });
      }
      
      res.json({
        success: true,
        message: 'Новость успешно добавлена',
        newsId: this.lastID
      });
    }
  );
});

// 4. Получение количества новостей
app.get('/api/news-count', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM news WHERE is_active = 1', (err, row) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка получения количества новостей' 
      });
    }
    
    res.json({
      success: true,
      count: row.count
    });
  });
});

// 5. Отладочный маршрут для проверки всех новостей
app.get('/api/debug/news', (req, res) => {
  db.all('SELECT * FROM news ORDER BY display_order ASC', (err, rows) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка базы данных: ' + err.message 
      });
    }
    res.json({
      success: true,
      total: rows.length,
      news: rows
    });
  });
});

// 6. Пересоздание таблицы новостей (для отладки)
app.post('/api/reset-news', (req, res) => {
  db.run('DROP TABLE IF EXISTS news', (err) => {
    if (err) {
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка удаления таблицы: ' + err.message 
      });
    }
    
    console.log('✅ Таблица news удалена');
    
    // Переинициализируем базу данных
    initializeDatabase()
      .then(() => {
        res.json({
          success: true,
          message: 'Таблица новостей пересоздана и заполнена'
        });
      })
      .catch(error => {
        res.status(500).json({
          success: false,
          error: 'Ошибка пересоздания таблицы: ' + error.message
        });
      });
  });
});

// ==================== ОСТАЛЬНЫЕ API РОУТЫ ====================

// Регистрация пользователя
app.post('/api/register', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
    }

    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка сервера' });
      }
      if (row) {
        return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(
        'INSERT INTO users (first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?)',
        [first_name, last_name, email, phone, hashedPassword],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Ошибка при создании пользователя' });
          }

          const token = jwt.sign(
            { userId: this.lastID, email: email },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.json({
            success: true,
            message: 'Регистрация успешна',
            token: token,
            user: {
              id: this.lastID,
              first_name: first_name,
              last_name: last_name,
              email: email
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Авторизация
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка сервера' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Вход выполнен успешно',
      token: token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Статический HTML файл
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Инициализация и запуск сервера
initializeDatabase()
  .then(() => {
    console.log('✅ База данных успешно инициализирована');
    
    app.listen(PORT, () => {
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`📊 API доступно по адресу: http://localhost:${PORT}/api`);
      console.log(`📰 Новости из БД: http://localhost:${PORT}/api/news`);
      console.log(`🔍 Отладочная информация: http://localhost:${PORT}/api/debug/news`);
      console.log(`🔄 Сброс новостей: http://localhost:${PORT}/api/reset-news`);
      console.log('📋 База данных заполнена 5 новостями как на скриншоте');
    });
  })
  .catch(error => {
    console.error('❌ Ошибка инициализации базы данных:', error);
    process.exit(1);
  });