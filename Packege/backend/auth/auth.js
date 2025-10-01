const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../database');

const router = express.Router();
const JWT_SECRET = 'polyclinic-secret-key';

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { login, password, firstName, lastName, email, phone, role = 'patient' } = req.body;

    const userExists = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Логин уже занят' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (login, password_hash, first_name, last_name, email, phone, role) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, login, first_name, last_name, role`,
      [login, passwordHash, firstName, lastName, email, phone, role]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, login: user.login, role: user.role }, JWT_SECRET);

    res.json({
      success: true,
      message: 'Регистрация успешна!',
      token,
      user: {
        id: user.id,
        login: user.login,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { login, password, role } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Пользователь не найден' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, error: 'Неверный пароль' });
    }

    if (role && user.role !== role) {
      return res.status(400).json({ success: false, error: 'Неверная роль пользователя' });
    }

    const token = jwt.sign({ userId: user.id, login: user.login, role: user.role }, JWT_SECRET);

    res.json({
      success: true,
      message: 'Вход выполнен!',
      token,
      user: {
        id: user.id,
        login: user.login,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});

// API для врачей
router.get('/doctors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctors ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});

router.post('/doctors', async (req, res) => {
  try {
    const { firstName, lastName, specialization, roomNumber, birthDate, district, healthGroup, address } = req.body;
    const result = await pool.query(
      `INSERT INTO doctors (first_name, last_name, specialization, room_number, birth_date, district, health_group, address) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [firstName, lastName, specialization, roomNumber, birthDate, district, healthGroup, address]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});

router.delete('/doctors/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM doctors WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Врач удален' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});

// API для пациентов
router.get('/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});

router.post('/patients', async (req, res) => {
  try {
    const { firstName, lastName, birthDate, phone, address, healthGroup, cardNumber, district, note } = req.body;
    const result = await pool.query(
      `INSERT INTO patients (first_name, last_name, birth_date, phone, address, health_group, card_number, district, note) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [firstName, lastName, birthDate, phone, address, healthGroup, cardNumber, district, note]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});

router.delete('/patients/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM patients WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Пациент удален' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});

// API для талонов
router.post('/appointments', async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate } = req.body;
    const ticketNumber = 'T' + Date.now(); // Генерируем уникальный номер талона
    
    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, ticket_number) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [patientId, doctorId, appointmentDate, ticketNumber]
    );
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});

module.exports = router;