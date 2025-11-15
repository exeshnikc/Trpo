const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database with sample data
function initializeDatabase() {
  // Create tables
  db.serialize(() => {
    // Doctors table
    db.run(`CREATE TABLE doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      middle_name TEXT,
      specialty TEXT NOT NULL,
      experience INTEGER NOT NULL,
      room_number TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Doctor schedule table
    db.run(`CREATE TABLE doctor_schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doctor_id INTEGER,
      day_of_week TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      is_available BOOLEAN DEFAULT 1,
      FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    )`);

    // Appointments table
    db.run(`CREATE TABLE appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_name TEXT NOT NULL,
      patient_phone TEXT NOT NULL,
      doctor_id INTEGER,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    )`);

    // Users table for patient portal
    db.run(`CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert sample doctors
    const insertDoctor = db.prepare(`INSERT INTO doctors 
      (first_name, last_name, middle_name, specialty, experience, room_number) 
      VALUES (?, ?, ?, ?, ?, ?)`);
    
    const doctors = [
      ['Александр', 'Абашин', 'Викторович', 'Терапевт', 15, '101'],
      ['Дмитрий', 'Адинец', 'Олегович', 'Педиатр', 8, '202'],
      ['Михаил', 'Грецкий', 'Геннадьевич', 'Кардиолог', 20, '305'],
      ['Елена', 'Козаченко', 'Николаевна', 'Хирург', 12, '410'],
      ['Ирина', 'Семёнова', 'Петровна', 'Невролог', 18, '215'],
      ['Олег', 'Петров', 'Сергеевич', 'Офтальмолог', 10, '312']
    ];

    doctors.forEach(doctor => {
      insertDoctor.run(doctor);
    });
    insertDoctor.finalize();

    // Insert sample schedule
    db.run(`INSERT INTO doctor_schedule (doctor_id, day_of_week, start_time, end_time) VALUES
      (1, 'Пн', '08:00', '14:00'),
      (1, 'Ср', '08:00', '14:00'),
      (1, 'Пт', '08:00', '14:00'),
      (2, 'Вт', '09:00', '15:00'),
      (2, 'Чт', '09:00', '15:00'),
      (2, 'Сб', '09:00', '15:00'),
      (3, 'Пн', '10:00', '16:00'),
      (3, 'Вт', '10:00', '16:00'),
      (3, 'Ср', '10:00', '16:00'),
      (3, 'Чт', '10:00', '16:00'),
      (3, 'Пт', '10:00', '16:00'),
      (4, 'Ср', '12:00', '18:00'),
      (4, 'Пт', '12:00', '18:00'),
      (5, 'Пн', '09:00', '14:00'),
      (5, 'Вт', '09:00', '14:00'),
      (5, 'Чт', '09:00', '14:00'),
      (6, 'Вт', '10:00', '16:00'),
      (6, 'Ср', '10:00', '16:00'),
      (6, 'Пт', '10:00', '16:00')`);

    // Create demo user
    bcrypt.hash('password123', 10, (err, hash) => {
      if (err) return;
      db.run(`INSERT INTO users (email, password_hash, full_name, phone) 
              VALUES (?, ?, ?, ?)`, 
        ['patient@example.com', hash, 'Иван Иванов', '+375291234567']);
    });

    console.log('Database initialized with sample data');
  });
}

// API Routes

// Get all doctors with schedule
app.get('/api/doctors', (req, res) => {
  const { specialty, day, search } = req.query;
  
  let query = `
    SELECT 
      d.id,
      d.first_name,
      d.last_name,
      d.middle_name,
      d.specialty,
      d.experience,
      d.room_number,
      ds.day_of_week,
      ds.start_time,
      ds.end_time,
      ds.is_available
    FROM doctors d
    LEFT JOIN doctor_schedule ds ON d.id = ds.doctor_id
    WHERE 1=1
  `;
  
  const params = [];

  if (specialty) {
    query += ` AND d.specialty = ?`;
    params.push(specialty);
  }

  if (day) {
    query += ` AND ds.day_of_week = ?`;
    params.push(day);
  }

  if (search) {
    query += ` AND (d.first_name LIKE ? OR d.last_name LIKE ? OR d.specialty LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY d.last_name, d.first_name, ds.day_of_week';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // Group schedule by doctor
    const doctors = {};
    rows.forEach(row => {
      if (!doctors[row.id]) {
        doctors[row.id] = {
          id: row.id,
          name: `${row.last_name} ${row.first_name} ${row.middle_name}`,
          specialty: row.specialty,
          experience: row.experience,
          room: row.room_number,
          schedule: []
        };
      }
      
      if (row.day_of_week) {
        doctors[row.id].schedule.push({
          day: row.day_of_week,
          time: `${row.start_time} – ${row.end_time}`,
          isAvailable: row.is_available === 1
        });
      }
    });

    res.json(Object.values(doctors));
  });
});

// Get available specialties
app.get('/api/specialties', (req, res) => {
  db.all('SELECT DISTINCT specialty FROM doctors ORDER BY specialty', (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    const specialties = rows.map(row => row.specialty);
    res.json(specialties);
  });
});

// Create appointment
app.post('/api/appointments', (req, res) => {
  const { patientName, patientPhone, doctorId, appointmentDate, appointmentTime } = req.body;
  
  if (!patientName || !patientPhone || !doctorId || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    `INSERT INTO appointments (patient_name, patient_phone, doctor_id, appointment_date, appointment_time, status)
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [patientName, patientPhone, doctorId, appointmentDate, appointmentTime],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create appointment' });
      }

      res.json({ 
        success: true, 
        appointment: {
          id: this.lastID,
          patientName,
          patientPhone,
          doctorId,
          appointmentDate,
          appointmentTime,
          status: 'pending'
        }
      });
    }
  );
});

// Get appointments for a patient
app.get('/api/appointments', (req, res) => {
  const { phone } = req.query;
  
  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const query = `
    SELECT a.*, d.first_name, d.last_name, d.middle_name, d.specialty
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    WHERE a.patient_phone = ?
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
  `;

  db.all(query, [phone], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const appointments = rows.map(row => ({
      id: row.id,
      patientName: row.patient_name,
      patientPhone: row.patient_phone,
      doctorName: `${row.last_name} ${row.first_name} ${row.middle_name}`,
      doctorSpecialty: row.specialty,
      appointmentDate: row.appointment_date,
      appointmentTime: row.appointment_time,
      status: row.status,
      createdAt: row.created_at
    }));

    res.json(appointments);
  });
});

// User authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.password_hash, (err, result) => {
      if (err) {
        console.error('Bcrypt error:', err);
        return res.status(500).json({ error: 'Authentication error' });
      }

      if (!result) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          phone: user.phone
        }
      });
    });
  });
});

// Update appointment status
app.put('/api/appointments/:id', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run(
    'UPDATE appointments SET status = ? WHERE id = ?',
    [status, req.params.id],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update appointment' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.json({ success: true });
    }
  );
});

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/raspisanie', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'raspisanie.html'));
});

app.get('/information', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'information.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('API endpoints available at:');
  console.log('  GET  /api/doctors');
  console.log('  GET  /api/specialties');
  console.log('  POST /api/appointments');
  console.log('  GET  /api/appointments?phone=...');
  console.log('  POST /api/auth/login');
});