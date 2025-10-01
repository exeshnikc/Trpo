// Базовые функции для работы с API
const API_BASE_URL = 'http://localhost:3000/api';

class NewsManager {
    constructor() {
        this.currentNews = [];
    }

    // Загрузка новостей из базы данных
    async loadNewsFromDB(limit = 10, category = null) {
        try {
            console.log('Загружаем новости из базы данных...');
            
            let url = `/news?limit=${limit}`;
            if (category) {
                url += `&category=${category}`;
            }

            const response = await apiRequest(url);
            
            if (response.success) {
                this.currentNews = response.news;
                console.log(`✅ Загружено ${response.news.length} новостей из БД`);
                return response.news;
            } else {
                throw new Error(response.error || 'Ошибка загрузки новостей');
            }
        } catch (error) {
            console.error('❌ Ошибка при загрузке новостей:', error);
            this.showErrorMessage('Не удалось загрузить новости. Попробуйте обновить страницу.');
            return [];
        }
    }

    // Отображение новостей в горизонтальной прокрутке
    async renderNewsCarousel() {
        const newsContainer = document.getElementById('news-carousel');
        const newsSection = document.querySelector('.news-section');
        
        if (!newsContainer || !newsSection) {
            console.error('Контейнер для новостей не найден');
            return;
        }

        // Показываем индикатор загрузки
        newsContainer.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Загрузка новостей из базы данных...</p>
            </div>
        `;

        try {
            // Загружаем новости из БД
            const news = await this.loadNewsFromDB(10);
            
            if (news.length === 0) {
                newsContainer.innerHTML = `
                    <div class="no-news">
                        <p>Новости временно недоступны</p>
                    </div>
                `;
                return;
            }

            // Рендерим новости
            newsContainer.innerHTML = news.map(item => `
                <div class="news-card" data-news-id="${item.id}" data-category="${item.category}">
                    <div class="news-date">${this.formatDate(item.date)}</div>
                    <h4 class="news-title">${this.escapeHtml(item.title)}</h4>
                    <p class="news-description">${this.escapeHtml(item.description || '')}</p>
                    ${item.image_url ? `
                        <div class="news-image">
                            <img src="${item.image_url}" alt="${this.escapeHtml(item.title)}" 
                                 onerror="this.style.display='none'">
                        </div>
                    ` : ''}
                    <span class="news-category">${this.getCategoryLabel(item.category)}</span>
                </div>
            `).join('');

            // Настраиваем горизонтальную прокрутку
            this.setupHorizontalScroll(newsContainer);
            
            // Добавляем обработчики событий
            this.addNewsEventListeners();

            console.log('✅ Новости успешно отображены');

        } catch (error) {
            console.error('❌ Ошибка при отображении новостей:', error);
            newsContainer.innerHTML = `
                <div class="error-message">
                    <p>Ошибка загрузки новостей</p>
                    <button onclick="newsManager.renderNewsCarousel()" class="retry-button">
                        Попробовать снова
                    </button>
                </div>
            `;
        }
    }

    // Форматирование даты
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    // Экранирование HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Получение метки категории
    getCategoryLabel(category) {
        const labels = {
            'equipment': 'Оборудование',
            'vaccination': 'Вакцинация',
            'schedule': 'Расписание',
            'doctors': 'Врачи',
            'events': 'События',
            'general': 'Общее'
        };
        return labels[category] || category;
    }

    // Настройка горизонтальной прокрутки
    setupHorizontalScroll(container) {
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('active');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active');
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active');
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });

        // Добавляем кнопки навигации
        this.addNavigationButtons(container);
    }

    // Добавление кнопок навигации
    addNavigationButtons(container) {
        // Удаляем старые кнопки если есть
        const oldNav = container.parentNode.querySelector('.news-navigation');
        if (oldNav) {
            oldNav.remove();
        }

        const navContainer = document.createElement('div');
        navContainer.className = 'news-navigation';
        
        const prevButton = document.createElement('button');
        prevButton.className = 'nav-button prev';
        prevButton.innerHTML = '‹';
        prevButton.title = 'Предыдущие новости';
        prevButton.onclick = () => {
            container.scrollBy({ left: -300, behavior: 'smooth' });
        };

        const nextButton = document.createElement('button');
        nextButton.className = 'nav-button next';
        nextButton.innerHTML = '›';
        nextButton.title = 'Следующие новости';
        nextButton.onclick = () => {
            container.scrollBy({ left: 300, behavior: 'smooth' });
        };

        navContainer.appendChild(prevButton);
        navContainer.appendChild(nextButton);
        
        container.parentNode.appendChild(navContainer);
    }

    // Добавление обработчиков событий для новостей
    addNewsEventListeners() {
        const newsCards = document.querySelectorAll('.news-card');
        newsCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const newsId = card.getAttribute('data-news-id');
                this.openNewsModal(newsId);
            });
        });
    }

    // Открытие модального окна с новостью
    async openNewsModal(newsId) {
        try {
            const response = await apiRequest(`/news/${newsId}`);
            if (response.success) {
                this.showNewsModal(response.news);
            }
        } catch (error) {
            console.error('Ошибка при загрузке деталей новости:', error);
        }
    }

    // Показ модального окна с новостью
    showNewsModal(news) {
        // Реализация модального окна
        console.log('Открываем новость:', news);
        // Здесь можно добавить красивый модальный попап
        alert(`Новость: ${news.title}\n\n${news.description || 'Описание отсутствует'}`);
    }

    // Показать сообщение об ошибке
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'news-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span>` 
    }}