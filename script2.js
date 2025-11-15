// Инициализация карты после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    // Координаты поликлиники (примерные координаты Минска)
    const clinicCoords = [53.9023, 27.5619];
    
    // Создаем карту
    const map = L.map('map').setView(clinicCoords, 15);
    
    // Добавляем слой карты OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Добавляем маркер поликлиники
    const clinicMarker = L.marker(clinicCoords).addTo(map);
    clinicMarker.bindPopup(`
        <div style="text-align: center;">
            <b>Городская поликлиника №26</b><br>
            <small>ул. Колесникова 3</small><br>
            <br>
            <i class="fas fa-phone" style="color: #00796b;"></i> +375-25-751-77-10<br>
            <i class="fas fa-clock" style="color: #00796b;"></i> Пн-Пт: 8:00-20:00
        </div>
    `).openPopup();

    // Добавляем круг для обозначения территории
    L.circle(clinicCoords, {
        color: '#00796b',
        fillColor: '#00796b',
        fillOpacity: 0.1,
        radius: 100
    }).addTo(map);
});

// Анимация появления элементов при скролле
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Применяем анимацию к элементам
    const animatedElements = document.querySelectorAll('.service-card, .stat-item, .mission-section, .history-section');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Добавляем интерактивность для карточек услуг
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
});

// Плавная прокрутка для кнопки "Вернуться на главную"
document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.querySelector('.back-button');
    
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Добавляем анимацию перед переходом
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                window.location.href = href;
            }, 150);
        });
    }
});

// Добавляем анимацию для статистики
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const targetNumber = parseInt(statNumber.textContent.replace('+', ''));
                const duration = 2000; // 2 seconds
                const step = targetNumber / (duration / 16); // 60fps
                let currentNumber = 0;
                
                const timer = setInterval(() => {
                    currentNumber += step;
                    if (currentNumber >= targetNumber) {
                        currentNumber = targetNumber;
                        clearInterval(timer);
                    }
                    statNumber.textContent = Math.floor(currentNumber) + (statNumber.textContent.includes('+') ? '+' : '');
                }, 16);
                
                observer.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(statNumber => {
        observer.observe(statNumber);
    });
});