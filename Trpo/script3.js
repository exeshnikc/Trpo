// Particles Background
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 6 + 2;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 20;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.opacity = Math.random() * 0.5 + 0.3;
    
    container.appendChild(particle);
  }
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Бургер-меню
function initBurgerMenu() {
  const burgerMenu = document.getElementById('burgerMenu');
  const mobileNav = document.getElementById('mobileNav');
  const overlay = document.getElementById('overlay');

  if (!burgerMenu || !mobileNav || !overlay) return;

  burgerMenu.addEventListener('click', function() {
    this.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  });

  overlay.addEventListener('click', function() {
    burgerMenu.classList.remove('active');
    mobileNav.classList.remove('active');
    this.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close mobile menu when clicking on links
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

// Кнопка "Наверх"
function initBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  if (!backToTopButton) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  backToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Функция для фильтрации таблицы
function initTableFilter() {
  const searchInput = document.getElementById('searchInput');
  const specialtyFilter = document.getElementById('specialtyFilter');
  const dayFilter = document.getElementById('dayFilter');
  const timeFilter = document.getElementById('timeFilter');
  const table = document.getElementById('scheduleTable');

  if (!searchInput || !specialtyFilter || !dayFilter || !timeFilter || !table) return;

  function filterTable() {
    const searchText = searchInput.value.toLowerCase();
    const specialtyValue = specialtyFilter.value;
    const dayValue = dayFilter.value;
    const timeValue = timeFilter.value;
    
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
      const doctorName = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
      const specialty = rows[i].getElementsByTagName('td')[1].textContent;
      const days = rows[i].getElementsByTagName('td')[3].textContent;
      const timeSlot = rows[i].getElementsByTagName('td')[4].textContent;
      
      const nameMatch = doctorName.includes(searchText) || 
                       specialty.toLowerCase().includes(searchText);
      const specialtyMatch = specialtyValue === '' || specialty === specialtyValue;
      const dayMatch = dayValue === '' || days.includes(dayValue);
      
      // Фильтрация по времени
      let timeMatch = true;
      if (timeValue !== '') {
        const timeText = timeSlot.toLowerCase();
        if (timeValue === 'утро') {
          timeMatch = timeText.includes('08:00') || timeText.includes('09:00') || 
                     timeText.includes('10:00') || timeText.includes('11:00');
        } else if (timeValue === 'день') {
          timeMatch = timeText.includes('12:00') || timeText.includes('13:00') || 
                     timeText.includes('14:00') || timeText.includes('15:00');
        } else if (timeValue === 'вечер') {
          timeMatch = timeText.includes('16:00') || timeText.includes('17:00') || 
                     timeText.includes('18:00') || timeText.includes('19:00');
        }
      }
      
      if (nameMatch && specialtyMatch && dayMatch && timeMatch) {
        rows[i].style.display = '';
        rows[i].style.opacity = '1';
        rows[i].style.transform = 'translateY(0)';
      } else {
        rows[i].style.display = 'none';
      }
    }
    
    // Показать сообщение, если ничего не найдено
    showNoResultsMessage(rows);
  }
  
  function showNoResultsMessage(rows) {
    let visibleRows = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].style.display !== 'none') {
        visibleRows++;
      }
    }
    
    let existingMessage = document.getElementById('noResultsMessage');
    if (visibleRows === 0) {
      if (!existingMessage) {
        const message = document.createElement('div');
        message.id = 'noResultsMessage';
        message.style.cssText = `
          text-align: center;
          padding: 40px;
          color: var(--gray-light);
          font-size: 1.1rem;
          background: var(--gradient-glass);
          border-radius: var(--radius);
          margin: 20px 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        `;
        message.innerHTML = `
          <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 15px; display: block; color: var(--primary-light);"></i>
          <p>По вашему запросу ничего не найдено</p>
          <p style="font-size: 0.9rem; margin-top: 10px; opacity: 0.8;">Попробуйте изменить параметры поиска</p>
        `;
        table.parentNode.insertBefore(message, table.nextSibling);
      }
    } else if (existingMessage) {
      existingMessage.remove();
    }
  }
  
  // Добавляем обработчики событий для фильтров
  searchInput.addEventListener('input', filterTable);
  specialtyFilter.addEventListener('change', filterTable);
  dayFilter.addEventListener('change', filterTable);
  timeFilter.addEventListener('change', filterTable);
  
  // Инициализируем фильтрацию при загрузке
  filterTable();
}

// Анимация появления строк таблицы
function initTableAnimations() {
  const table = document.getElementById('scheduleTable');
  if (!table) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const rows = entry.target.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        Array.from(rows).forEach((row, index) => {
          setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
          }, index * 100);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Применяем начальные стили и наблюдаем
  const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  Array.from(rows).forEach(row => {
    row.style.opacity = '0';
    row.style.transform = 'translateY(20px)';
    row.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  observer.observe(table);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  createParticles();
  initHeaderScroll();
  initBurgerMenu();
  initBackToTop();
  initTableFilter();
  initTableAnimations();
  
  // Add loading animation
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Добавляем интерактивность для строк таблицы
document.addEventListener('DOMContentLoaded', function() {
  const tableRows = document.querySelectorAll('#scheduleTable tbody tr');
  
  tableRows.forEach(row => {
    row.addEventListener('click', function() {
      // Добавляем/убираем класс выделения
      this.classList.toggle('selected');
      
      // Можно добавить дополнительную логику при клике на строку
      const doctorName = this.querySelector('.doctor-name').textContent;
      const specialty = this.querySelector('.specialty-badge').textContent;
      
      console.log(`Выбран врач: ${doctorName}, ${specialty}`);
    });
  });
});

// Функция для сброса фильтров
function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('specialtyFilter').value = '';
  document.getElementById('dayFilter').value = '';
  document.getElementById('timeFilter').value = '';
  
  // Триггерим событие изменения для применения фильтрации
  const event = new Event('change');
  document.getElementById('specialtyFilter').dispatchEvent(event);
}