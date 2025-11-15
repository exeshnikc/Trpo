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
    const timeFilter = document.getElementById('timeFilter');
    
    if (searchInput.value) searchParams.append('search', searchInput.value);
    if (specialtyFilter.value) searchParams.append('specialty', specialtyFilter.value);
    if (dayFilter.value) searchParams.append('day', dayFilter.value);
    
    const response = await fetch(`${API_BASE}/doctors?${searchParams}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    allDoctors = await response.json();
    
    // Apply time filter on client side
    let filteredDoctors = allDoctors;
    if (timeFilter.value) {
      filteredDoctors = filterDoctorsByTime(allDoctors, timeFilter.value);
    }
    
    renderDoctors(filteredDoctors);
    
  } catch (error) {
    console.error('Error loading doctors:', error);
    showError('Ошибка загрузки данных. Пожалуйста, попробуйте позже.');
  } finally {
    hideLoading();
  }
}

// Filter doctors by time slot
function filterDoctorsByTime(doctors, timeFilter) {
  return doctors.filter(doctor => {
    return doctor.schedule.some(schedule => {
      const startHour = parseInt(schedule.time.split(':')[0]);
      
      switch (timeFilter) {
        case 'утро': return startHour >= 8 && startHour < 12;
        case 'день': return startHour >= 12 && startHour < 16;
        case 'вечер': return startHour >= 16 && startHour < 20;
        default: return true;
      }
    });
  });
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
    const timeSlots = {};
    doctor.schedule.forEach(sched => {
      if (!daysMap[sched.day]) {
        daysMap[sched.day] = true;
      }
      // Store time for each day
      timeSlots[sched.day] = sched.time;
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
          ${days.map(day => `<span class="day-badge" title="${timeSlots[day]}">${day}</span>`).join('')}
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
      <td>
        <button class="appointment-btn" data-doctor-id="${doctor.id}" data-doctor-name="${doctor.name}">
          <i class="fas fa-calendar-plus"></i> Запись
        </button>
      </td>
    `;
    
    tbody.appendChild(row);
  });

  initTableInteractions();
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

// Table Row Interactions
function initTableInteractions() {
  const table = document.getElementById('scheduleTable');
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach(row => {
    // Click handler for row selection
    row.addEventListener('click', function(e) {
      if (!e.target.closest('button')) { // Don't trigger if clicking a button
        rows.forEach(r => r.classList.remove('selected'));
        this.classList.add('selected');
        
        const doctorName = this.querySelector('.doctor-name').textContent;
        const specialty = this.querySelector('.specialty-badge').textContent;
        console.log(`Selected: ${doctorName} - ${specialty}`);
      }
    });

    // Hover effects
    row.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(5px)';
      this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
    });

    row.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
      this.style.boxShadow = 'none';
    });
  });
}

// Status Badge Updates
function initStatusUpdates() {
  // Real-time status updates from server
  function updateStatuses() {
    loadDoctors(); // Reload data from server
  }

  // Update status every 30 seconds
  setInterval(updateStatuses, 30000);
}

// Appointment functionality
function initAppointmentButtons() {
  const buttons = document.querySelectorAll('.appointment-btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent row selection
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

// Submit appointment to server
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

// Back Button Functionality
function initBackButton() {
  const backButton = document.querySelector('.back-button');
  if (backButton) {
    backButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'main.html';
    });
  }
}

// Login Button Handlers
function initLoginButtons() {
  const loginButtons = document.querySelectorAll('.login-button, .mobile-login-button');
  
  loginButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'page1.html';
    });
  });
}

// Navigation Active State
function initNavigation() {
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav a, .mobile-nav a');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Header Scroll Effect
function initHeaderScroll() {
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Print Schedule Functionality
function initPrintFunctionality() {
  const controls = document.querySelector('.controls');
  const printButton = document.createElement('button');
  printButton.className = 'print-button';
  printButton.innerHTML = '<i class="fas fa-print"></i> Распечатать расписание';
  controls.appendChild(printButton);

  printButton.addEventListener('click', function() {
    window.print();
  });
}

// Export Schedule Functionality
function initExportFunctionality() {
  const controls = document.querySelector('.controls');
  const exportButton = document.createElement('button');
  exportButton.className = 'export-button';
  exportButton.innerHTML = '<i class="fas fa-download"></i> Экспорт';
  controls.appendChild(exportButton);

  exportButton.addEventListener('click', function() {
    exportToCSV();
  });
}

// Export to CSV
async function exportToCSV() {
  try {
    const response = await fetch(`${API_BASE}/doctors`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const doctors = await response.json();
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ФИО врача,Специальность,Кабинет,Дни приёма,Время приёма,Статус\n";
    
    doctors.forEach(doctor => {
      const days = doctor.schedule.map(sched => sched.day).join(',');
      const time = doctor.schedule[0] ? doctor.schedule[0].time : 'Не указано';
      const status = doctor.schedule[0] && doctor.schedule[0].isAvailable ? 'Свободно' : 'Занято';
      
      csvContent += `"${doctor.name}","${doctor.specialty}","${doctor.room}","${days}","${time}","${status}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "расписание_врачей.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Error exporting data:', error);
    alert('Ошибка при экспорте данных.');
  }
}

// Responsive Table Handling
function initResponsiveTable() {
  function handleResize() {
    const tableContainer = document.querySelector('.schedule-table-container');
    if (window.innerWidth < 768) {
      tableContainer.classList.add('mobile-view');
    } else {
      tableContainer.classList.remove('mobile-view');
    }
  }

  window.addEventListener('resize', handleResize);
  handleResize();
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
    
    message.querySelector('.clear-filters-btn').addEventListener('click', clearFilters);
  }
  message.style.display = 'block';
}

function hideNoResultsMessage() {
  const message = document.querySelector('.no-results-message');
  if (message) {
    message.style.display = 'none';
  }
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('specialtyFilter').value = '';
  document.getElementById('dayFilter').value = '';
  document.getElementById('timeFilter').value = '';
  loadDoctors();
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
  initStatusUpdates();
  initBackButton();
  initLoginButtons();
  initNavigation();
  initHeaderScroll();
  initPrintFunctionality();
  initExportFunctionality();
  initResponsiveTable();
  
  // Load initial data
  loadDoctors();
});

// Add CSS for animations and effects
const style = document.createElement('style');
style.textContent = `
  .particle {
    position: absolute;
    background: rgba(74, 107, 255, 0.2);
    border-radius: 50%;
    animation: float 15s infinite linear;
  }

  @keyframes float {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; }
  }

  .no-scroll {
    overflow: hidden;
  }

  .back-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .header.scrolled {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  }

  /* Table animations */
  #scheduleTable tbody tr {
    transition: all 0.3s ease;
    cursor: pointer;
  }

  #scheduleTable tbody tr.fade-in {
    animation: fadeInRow 0.5s ease;
  }

  @keyframes fadeInRow {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  #scheduleTable tbody tr.selected {
    background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
    border-left: 4px solid #4a6bff;
  }

  /* Status badge animations */
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .status-badge {
    transition: all 0.3s ease;
  }

  /* Appointment button */
  .appointment-btn {
    background: #4a6bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background 0.3s ease;
  }

  .appointment-btn:hover {
    background: #3a5bef;
  }

  /* Modal styles */
  .appointment-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .close-modal {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }

  .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .submit-btn {
    background: #4a6bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
  }

  /* Loading indicator */
  .loading-indicator {
    display: none;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    color: #4a6bff;
  }

  .loading-indicator i {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  /* Error message */
  .error-message {
    background: #fee;
    color: #c33;
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* No results message */
  .no-results-message {
    text-align: center;
    padding: 40px;
    background: #f8f9fa;
    border-radius: 10px;
    margin: 20px 0;
    display: none;
  }

  .no-results-message i {
    font-size: 3rem;
    color: #6c757d;
    margin-bottom: 15px;
  }

  .no-results-message p {
    color: #6c757d;
    margin-bottom: 15px;
    font-size: 1.1rem;
  }

  .clear-filters-btn {
    background: #4a6bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .clear-filters-btn:hover {
    background: #3a5bef;
  }

  /* Print and export buttons */
  .print-button, .export-button {
    background: #28a745;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
    transition: background 0.3s ease;
  }

  .export-button {
    background: #17a2b8;
  }

  .print-button:hover {
    background: #218838;
  }

  .export-button:hover {
    background: #138496;
  }

  /* Mobile table view */
  @media (max-width: 767px) {
    .schedule-table-container.mobile-view table {
      font-size: 0.9rem;
    }
    
    .schedule-table-container.mobile-view .doctor-avatar {
      width: 35px;
      height: 35px;
      font-size: 0.8rem;
    }
    
    .schedule-table-container.mobile-view .day-badge {
      padding: 2px 5px;
      font-size: 0.7rem;
    }
    
    .appointment-btn {
      padding: 6px 10px;
      font-size: 0.8rem;
    }
  }
`;
document.head.appendChild(style);