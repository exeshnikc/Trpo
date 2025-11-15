// script3.js

const API_BASE = '/api';

// Global variables
let allDoctors = [];

// Particles Background
function initParticles() {
  const container = document.getElementById('particles');
  const particleCount = 25;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 3 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const animationDuration = Math.random() * 15 + 10;
    const animationDelay = Math.random() * 3;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.animationDuration = `${animationDuration}s`;
    particle.style.animationDelay = `${animationDelay}s`;
    
    container.appendChild(particle);
  }
}

// Mobile Menu Functionality
function initMobileMenu() {
  const burgerMenu = document.getElementById('burgerMenu');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('overlay');

  function toggleMenu() {
    burgerMenu.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  }

  burgerMenu.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
  });
}

// Back to Top Button
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Load doctors from API
async function loadDoctors() {
  try {
    showLoading();
    
    const searchParams = new URLSearchParams();
    const searchInput = document.getElementById('searchInput');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const dayFilter = document.getElementById('dayFilter');
    
    if (searchInput.value) searchParams.append('search', searchInput.value);
    if (specialtyFilter.value) searchParams.append('specialty', specialtyFilter.value);
    if (dayFilter.value) searchParams.append('day', dayFilter.value);
    
    const response = await fetch(`${API_BASE}/doctors?${searchParams}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    allDoctors = await response.json();
    renderDoctors(allDoctors);
    
  } catch (error) {
    console.error('Error loading doctors:', error);
    showError('Ошибка загрузки данных. Пожалуйста, попробуйте позже.');
  } finally {
    hideLoading();
  }
}

// Render doctors to table
function renderDoctors(doctors) {
  const tbody = document.querySelector('#scheduleTable tbody');
  tbody.innerHTML = '';

  if (doctors.length === 0) {
    showNoResultsMessage();
    return;
  }

  hideNoResultsMessage();

  doctors.forEach(doctor => {
    const row = document.createElement('tr');
    
    // Group schedule by days
    const daysMap = {};
    doctor.schedule.forEach(sched => {
      if (!daysMap[sched.day]) {
        daysMap[sched.day] = sched.time;
      }
    });
    
    const days = Object.keys(daysMap);
    const firstSchedule = doctor.schedule[0];
    
    row.innerHTML = `
      <td>
        <div class="doctor-info">
          <div class="doctor-avatar">${getInitials(doctor.name)}</div>
          <div>
            <div class="doctor-name">${doctor.name}</div>
            <div class="doctor-exp">Стаж: ${doctor.experience} лет</div>
          </div>
        </div>
      </td>
      <td><span class="specialty-badge">${doctor.specialty}</span></td>
      <td>
        <div class="room-info">
          <i class="fas fa-door-open"></i>
          <span>${doctor.room}</span>
        </div>
      </td>
      <td>
        <div class="days-info">
          ${days.map(day => `<span class="day-badge">${day}</span>`).join('')}
        </div>
      </td>
      <td>
        <span class="time-slot">
          <i class="far fa-clock"></i> 
          ${firstSchedule ? firstSchedule.time : 'Не указано'}
        </span>
      </td>
      <td>
        <span class="status-badge ${firstSchedule && firstSchedule.isAvailable ? 'available' : 'busy'}">
          ${firstSchedule && firstSchedule.isAvailable ? 'Свободно' : 'Занято'}
        </span>
      </td>
    `;
    
    // Add appointment button
    const actionCell = document.createElement('td');
    actionCell.innerHTML = `
      <button class="appointment-btn" data-doctor-id="${doctor.id}" data-doctor-name="${doctor.name}">
        <i class="fas fa-calendar-plus"></i> Запись
      </button>
    `;
    row.appendChild(actionCell);
    
    tbody.appendChild(row);
  });

  initAppointmentButtons();
}

// Get initials for avatar
function getInitials(name) {
  return name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Search and Filter Functionality
function initSearchAndFilter() {
  const searchInput = document.getElementById('searchInput');
  const specialtyFilter = document.getElementById('specialtyFilter');
  const dayFilter = document.getElementById('dayFilter');
  const timeFilter = document.getElementById('timeFilter');

  // Load specialties from API
  loadSpecialties();

  function handleFilter() {
    loadDoctors();
  }

  // Event listeners
  searchInput.addEventListener('input', debounce(handleFilter, 300));
  specialtyFilter.addEventListener('change', handleFilter);
  dayFilter.addEventListener('change', handleFilter);
  timeFilter.addEventListener('change', handleFilter);
}

// Load specialties from API
async function loadSpecialties() {
  try {
    const response = await fetch(`${API_BASE}/specialties`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const specialties = await response.json();
    const specialtyFilter = document.getElementById('specialtyFilter');
    
    // Clear existing options except the first one
    specialtyFilter.innerHTML = '<option value="">Все специальности</option>';
    
    specialties.forEach(specialty => {
      const option = document.createElement('option');
      option.value = specialty;
      option.textContent = specialty;
      specialtyFilter.appendChild(option);
    });
    
  } catch (error) {
    console.error('Error loading specialties:', error);
  }
}

// Appointment functionality
function initAppointmentButtons() {
  const buttons = document.querySelectorAll('.appointment-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const doctorId = this.getAttribute('data-doctor-id');
      const doctorName = this.getAttribute('data-doctor-name');
      showAppointmentModal(doctorId, doctorName);
    });
  });
}

// Show appointment modal
function showAppointmentModal(doctorId, doctorName) {
  const modal = document.createElement('div');
  modal.className = 'appointment-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Запись на приём</h3>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <p>Врач: <strong>${doctorName}</strong></p>
        <form id="appointmentForm">
          <div class="form-group">
            <label for="patientName">Ваше ФИО:</label>
            <input type="text" id="patientName" required>
          </div>
          <div class="form-group">
            <label for="patientPhone">Телефон:</label>
            <input type="tel" id="patientPhone" required>
          </div>
          <div class="form-group">
            <label for="appointmentDate">Дата приёма:</label>
            <input type="date" id="appointmentDate" required>
          </div>
          <div class="form-group">
            <label for="appointmentTime">Время приёма:</label>
            <input type="time" id="appointmentTime" required>
          </div>
          <button type="submit" class="submit-btn">Записаться</button>
        </form>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Set min date to today
  const dateInput = document.getElementById('appointmentDate');
  dateInput.min = new Date().toISOString().split('T')[0];
  
  // Event listeners
  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.remove();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await submitAppointment(doctorId, modal);
  });
}

// Submit appointment
async function submitAppointment(doctorId, modal) {
  const formData = {
    patientName: document.getElementById('patientName').value,
    patientPhone: document.getElementById('patientPhone').value,
    doctorId: doctorId,
    appointmentDate: document.getElementById('appointmentDate').value,
    appointmentTime: document.getElementById('appointmentTime').value
  };
  
  try {
    const response = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Запись успешно создана! Мы свяжемся с вами для подтверждения.');
      modal.remove();
    } else {
      alert('Ошибка при создании записи: ' + result.error);
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    alert('Ошибка при создании записи. Пожалуйста, попробуйте позже.');
  }
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showLoading() {
  let loading = document.querySelector('.loading-indicator');
  if (!loading) {
    loading = document.createElement('div');
    loading.className = 'loading-indicator';
    loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Загрузка расписания...</span>';
    document.querySelector('.schedule-table-container').appendChild(loading);
  }
  loading.style.display = 'flex';
}

function hideLoading() {
  const loading = document.querySelector('.loading-indicator');
  if (loading) {
    loading.style.display = 'none';
  }
}

function showNoResultsMessage() {
  let message = document.querySelector('.no-results-message');
  if (!message) {
    message = document.createElement('div');
    message.className = 'no-results-message';
    message.innerHTML = `
      <i class="fas fa-search"></i>
      <p>По вашему запросу ничего не найдено</p>
      <button class="clear-filters-btn">Очистить фильтры</button>
    `;
    document.querySelector('.schedule-table-container').appendChild(message);
    
    message.querySelector('.clear-filters-btn').addEventListener('click', () => {
      document.getElementById('searchInput').value = '';
      document.getElementById('specialtyFilter').value = '';
      document.getElementById('dayFilter').value = '';
      document.getElementById('timeFilter').value = '';
      loadDoctors();
    });
  }
  message.style.display = 'block';
}

function hideNoResultsMessage() {
  const message = document.querySelector('.no-results-message');
  if (message) {
    message.style.display = 'none';
  }
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `
    <i class="fas fa-exclamation-triangle"></i>
    <span>${message}</span>
  `;
  document.querySelector('.controls').appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Initialize all functions
document.addEventListener('DOMContentLoaded', function() {
  initParticles();
  initMobileMenu();
  initBackToTop();
  initSearchAndFilter();
  loadDoctors(); // Load initial data
  
  // Other initializations...
  initBackButton();
  initLoginButtons();
  initNavigation();
  initHeaderScroll();
});