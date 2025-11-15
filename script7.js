// Particles Background
function createParticles() {
  const container = document.getElementById('particles-container');
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 4px and 12px
    const size = Math.random() * 8 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Random animation delay and duration
    const delay = Math.random() * 20;
    const duration = 15 + Math.random() * 15;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    container.appendChild(particle);
  }
}

// Header scroll effect
function handleHeaderScroll() {
  const header = document.querySelector('.header');
  const scrollY = window.scrollY;
  
  if (scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

// Mobile menu functionality
function initMobileMenu() {
  const burgerMenu = document.getElementById('burgerMenu');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('overlay');
  
  function toggleMenu() {
    burgerMenu.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = burgerMenu.classList.contains('active') ? 'hidden' : '';
  }
  
  burgerMenu.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);
  
  // Close menu when clicking on links
  const mobileLinks = mobileNav.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      burgerMenu.classList.remove('active');
      mobileNav.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// Back to top button
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  
  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', toggleBackToTop);
}

// Данные врачей
const doctors = {
  1: {
    name: "Иванова Мария Петровна",
    specialty: "Терапевт, высшая категория",
    room: "215",
    experience: "15 лет",
    rating: "4.8/5"
  },
  2: {
    name: "Петров Алексей Владимирович",
    specialty: "Хирург, первая категория",
    room: "312",
    experience: "12 лет",
    rating: "4.7/5"
  },
  3: {
    name: "Сидорова Елена Ивановна",
    specialty: "Педиатр, высшая категория",
    room: "118",
    experience: "18 лет",
    rating: "4.9/5"
  },
  4: {
    name: "Козлов Дмитрий Сергеевич",
    specialty: "Кардиолог, вторая категория",
    room: "204",
    experience: "8 лет",
    rating: "4.6/5"
  }
};

// Текущее состояние
let currentState = {
  step: 1,
  selectedDoctor: null,
  selectedDate: null,
  selectedTime: null,
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear()
};

// Функция для показа сообщения об успешной записи
function showSuccess() {
  document.getElementById('step2Content').style.display = 'none';
  document.getElementById('successMessage').style.display = 'block';
  
  // Обновляем информацию в сообщении об успехе
  document.getElementById('successDoctor').textContent = doctors[currentState.selectedDoctor].name;
  document.getElementById('successDate').textContent = formatDate(currentState.selectedDate);
  document.getElementById('successTime').textContent = currentState.selectedTime;
  document.getElementById('successTicket').textContent = generateTicketNumber();
}

// Функция для печати талона
function printTicket() {
  alert('Функция печати талона будет реализована в полной версии системы');
  // В реальной системе здесь будет код для печати талона
}

// Функция для перехода на главную страницу
function goToMain() {
  window.location.href = 'main.html';
}

// Функция для перехода к шагу 2
function goToStep2() {
  if (!currentState.selectedDoctor) return;
  
  currentState.step = 2;
  updateSteps();
  document.getElementById('step1Content').style.display = 'none';
  document.getElementById('step2Content').style.display = 'flex';
  
  // Обновляем информацию о выбранном враче
  const doctor = doctors[currentState.selectedDoctor];
  document.getElementById('selectedDoctorName').textContent = doctor.name;
  document.getElementById('selectedDoctorSpecialty').textContent = doctor.specialty;
  document.getElementById('summaryDoctor').textContent = doctor.name.split(' ')[0] + ' ' + doctor.name.split(' ')[1].charAt(0) + '.' + doctor.name.split(' ')[2].charAt(0) + '.';
  document.getElementById('summarySpecialty').textContent = doctor.specialty.split(',')[0];
  document.getElementById('summaryRoom').textContent = doctor.room;
  
  // Генерируем календарь
  generateCalendar();
}

// Функция для перехода к шагу 1
function goToStep1() {
  currentState.step = 1;
  updateSteps();
  document.getElementById('step1Content').style.display = 'flex';
  document.getElementById('step2Content').style.display = 'none';
}

// Функция для перехода к шагу 3
function goToStep3() {
  if (!currentState.selectedDate || !currentState.selectedTime) return;
  
  currentState.step = 3;
  updateSteps();
  showSuccess();
}

// Функция для обновления отображения шагов
function updateSteps() {
  // Сбрасываем все шаги
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active', 'completed');
  });
  
  // Устанавливаем активные и завершенные шаги
  for (let i = 1; i <= currentState.step; i++) {
    const stepElement = document.getElementById(`step${i}`);
    if (i === currentState.step) {
      stepElement.classList.add('active');
    } else {
      stepElement.classList.add('completed');
    }
  }
}

// Функция для генерации календаря
function generateCalendar() {
  const calendarGrid = document.getElementById('calendarGrid');
  const currentMonthElement = document.getElementById('currentMonth');
  
  // Очищаем календарь
  calendarGrid.innerHTML = '';
  
  // Устанавливаем заголовок месяца
  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  currentMonthElement.textContent = `${monthNames[currentState.currentMonth]} ${currentState.currentYear}`;
  
  // Добавляем заголовки дней недели
  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  dayNames.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    calendarGrid.appendChild(dayElement);
  });
  
  // Получаем первый день месяца и количество дней в месяце
  const firstDay = new Date(currentState.currentYear, currentState.currentMonth, 1);
  const lastDay = new Date(currentState.currentYear, currentState.currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Получаем день недели первого дня месяца (0 - воскресенье, 1 - понедельник, ...)
  let firstDayOfWeek = firstDay.getDay();
  if (firstDayOfWeek === 0) firstDayOfWeek = 7; // Воскресенье становится 7
  
  // Добавляем пустые ячейки для дней предыдущего месяца
  for (let i = 1; i < firstDayOfWeek; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-date disabled';
    emptyCell.textContent = '';
    calendarGrid.appendChild(emptyCell);
  }
  
  // Добавляем дни текущего месяца
  const today = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(today.getDate() + 14);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentState.currentYear, currentState.currentMonth, day);
    const dateElement = document.createElement('div');
    dateElement.className = 'calendar-date';
    dateElement.textContent = day;
    
    // Проверяем, доступна ли дата для записи (не прошлая и не более чем через 2 недели)
    if (date < today || date > twoWeeksFromNow) {
      dateElement.classList.add('disabled');
    } else {
      dateElement.classList.add('available');
      dateElement.addEventListener('click', () => selectDate(date, dateElement));
      
      // Если это выбранная дата, выделяем ее
      if (currentState.selectedDate && 
          date.getDate() === currentState.selectedDate.getDate() &&
          date.getMonth() === currentState.selectedDate.getMonth() &&
          date.getFullYear() === currentState.selectedDate.getFullYear()) {
        dateElement.classList.add('selected');
      }
    }
    
    calendarGrid.appendChild(dateElement);
  }
}

// Функция для выбора даты
function selectDate(date, element) {
  // Снимаем выделение с предыдущей выбранной даты
  document.querySelectorAll('.calendar-date.selected').forEach(el => {
    el.classList.remove('selected');
  });
  
  // Выделяем новую дату
  element.classList.add('selected');
  currentState.selectedDate = date;
  
  // Обновляем информацию в сводке
  document.getElementById('summaryDate').textContent = formatDate(date);
  
  // Генерируем доступные временные слоты
  generateTimeSlots();
  
  // Проверяем, можно ли активировать кнопку продолжения
  checkStep2Completion();
}

// Функция для генерации временных слотов
function generateTimeSlots() {
  const timeSlotsContainer = document.getElementById('timeSlots');
  timeSlotsContainer.innerHTML = '';
  
  // Временные слоты с 8:00 до 20:00 с интервалом 30 минут
  const startHour = 8;
  const endHour = 20;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const timeSlot = document.createElement('div');
      timeSlot.className = 'time-slot';
      timeSlot.textContent = timeString;
      
      // Случайным образом делаем некоторые слоты недоступными для имитации занятости
      if (Math.random() > 0.7) {
        timeSlot.classList.add('disabled');
      } else {
        timeSlot.addEventListener('click', () => selectTime(timeString, timeSlot));
        
        // Если это выбранное время, выделяем его
        if (currentState.selectedTime === timeString) {
          timeSlot.classList.add('selected');
        }
      }
      
      timeSlotsContainer.appendChild(timeSlot);
    }
  }
}

// Функция для выбора времени
function selectTime(time, element) {
  // Снимаем выделение с предыдущего выбранного времени
  document.querySelectorAll('.time-slot.selected').forEach(el => {
    el.classList.remove('selected');
  });
  
  // Выделяем новое время
  element.classList.add('selected');
  currentState.selectedTime = time;
  
  // Обновляем информацию в сводке
  document.getElementById('summaryTime').textContent = time;
  
  // Проверяем, можно ли активировать кнопку продолжения
  checkStep2Completion();
}

// Функция для проверки завершенности шага 2
function checkStep2Completion() {
  const canContinue = currentState.selectedDate && currentState.selectedTime;
  document.getElementById('nextStep2').disabled = !canContinue;
  document.getElementById('confirmStep2').disabled = !canContinue;
}

// Функция для форматирования даты
function formatDate(date) {
  const monthNames = ["января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

// Функция для генерации номера талона
function generateTicketNumber() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  let result = '';
  
  // Добавляем случайную букву
  result += letters.charAt(Math.floor(Math.random() * letters.length));
  result += '-';
  
  // Добавляем 4 случайные цифры
  for (let i = 0; i < 4; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return result;
}

// Doctor cards animation
function initDoctorCardsAnimation() {
  const doctorCards = document.querySelectorAll('.doctor-card');
  
  doctorCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 200);
  });
}

// Calendar animation
function initCalendarAnimation() {
  const calendarDates = document.querySelectorAll('.calendar-date');
  
  calendarDates.forEach((date, index) => {
    date.style.opacity = '0';
    date.style.transform = 'scale(0.8)';
    date.style.transition = 'all 0.3s ease';
    
    setTimeout(() => {
      date.style.opacity = '1';
      date.style.transform = 'scale(1)';
    }, index * 20);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  createParticles();
  initMobileMenu();
  initBackToTop();
  initDoctorCardsAnimation();
  
  // Выбор врача
  document.querySelectorAll('.doctor-card').forEach(card => {
    card.addEventListener('click', function() {
      // Снимаем выделение с предыдущего выбранного врача
      document.querySelectorAll('.doctor-card.selected').forEach(selected => {
        selected.classList.remove('selected');
      });
      
      // Выделяем нового врача
      this.classList.add('selected');
      currentState.selectedDoctor = this.getAttribute('data-doctor');
      
      // Активируем кнопку продолжения
      document.getElementById('nextStep1').disabled = false;
    });
  });

  // Навигация по месяцам в календаре
  document.getElementById('prevMonth').addEventListener('click', function() {
    currentState.currentMonth--;
    if (currentState.currentMonth < 0) {
      currentState.currentMonth = 11;
      currentState.currentYear--;
    }
    generateCalendar();
    initCalendarAnimation();
  });

  document.getElementById('nextMonth').addEventListener('click', function() {
    currentState.currentMonth++;
    if (currentState.currentMonth > 11) {
      currentState.currentMonth = 0;
      currentState.currentYear++;
    }
    generateCalendar();
    initCalendarAnimation();
  });

  // Инициализация календаря
  generateCalendar();
  initCalendarAnimation();
  
  window.addEventListener('scroll', handleHeaderScroll);
  
  // Initial header state
  handleHeaderScroll();
});

// Add CSS for additional animations
const style = document.createElement('style');
style.textContent = `
  .doctor-card {
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  .calendar-date {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  .time-slot {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .booking-form,
  .booking-summary {
    animation: fadeInUp 0.6s ease;
  }
`;
document.head.appendChild(style);