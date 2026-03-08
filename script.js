class App {
    constructor() {
        // Экраны
        this.screens = {
            timer: document.getElementById('timer'),
            words: document.getElementById('words'),
            cat: document.getElementById('cat'),
            book: document.getElementById('book'),
            final: document.getElementById('final')
        };
        
        // Элементы
        this.timerNumber = document.getElementById('timerNumber');
        this.wordsStage = document.getElementById('wordsStage');
        this.catTimer = document.getElementById('catTimer');
        this.pages = document.querySelectorAll('.book-page');
        this.prevBtn = document.getElementById('prevPage');
        this.nextBtn = document.getElementById('nextPage');
        this.pageCounter = document.getElementById('pageCounter');
        this.heartCanvas = document.getElementById('heartCanvas');
        this.particlesContainer = document.getElementById('floatingParticles');
        
        // Переменные
        this.currentPage = 1;
        this.totalPages = 7;
        this.timerInterval = null;
        this.catInterval = null;
        
        this.init();
    }
    
    init() {
        this.createParticles();
        this.showScreen('timer');
        this.startTimer();
        this.setupBook();
    }
    
    createParticles() {
        if (!this.particlesContainer) return;
        
        const symbols = ['✨', '💫', '⭐', '🌸', '✨'];
        
        setInterval(() => {
            for (let i = 0; i < 2; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                particle.style.left = Math.random() * 100 + '%';
                particle.style.fontSize = (15 + Math.random() * 25) + 'px';
                particle.style.animationDuration = (8 + Math.random() * 5) + 's';
                this.particlesContainer.appendChild(particle);
                setTimeout(() => particle.remove(), 13000);
            }
        }, 300);
    }
    
    showScreen(name) {
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        
        if (this.screens[name]) {
            this.screens[name].classList.add('active');
        }
        
        if (name === 'words') this.showWords();
        if (name === 'cat') this.startCatTimer();
        if (name === 'final') this.createHeartGallery();
    }
    
    startTimer() {
        let count = 3;
        if (!this.timerNumber) return;
        
        this.timerNumber.textContent = count;
        
        this.timerInterval = setInterval(() => {
            count--;
            if (count > 0) {
                this.timerNumber.textContent = count;
            } else {
                clearInterval(this.timerInterval);
                setTimeout(() => this.showScreen('words'), 500);
            }
        }, 1000);
    }
    
    showWords() {
        const words = [
            { text: '❤️', className: 'word-heart' },
            { text: 'с', className: '' },
            { text: '8', className: '' },
            { text: 'марта', className: '' },
            { text: 'ботақаным', className: 'word-kazakh' }
        ];
        
        let index = 0;
        
        const showNext = () => {
            if (index >= words.length) {
                setTimeout(() => this.showScreen('cat'), 1000);
                return;
            }
            
            if (!this.wordsStage) return;
            
            this.wordsStage.innerHTML = '';
            
            const wordEl = document.createElement('div');
            wordEl.className = `word ${words[index].className}`;
            wordEl.textContent = words[index].text;
            
            // Принудительное центрирование
            wordEl.style.position = 'absolute';
            wordEl.style.left = '50%';
            wordEl.style.top = '50%';
            wordEl.style.transform = 'translate(-50%, -50%) scale(0.5)';
            
            this.wordsStage.appendChild(wordEl);
            
            setTimeout(() => wordEl.classList.add('visible'), 100);
            
            setTimeout(() => {
                wordEl.classList.remove('visible');
                wordEl.classList.add('hiding');
                setTimeout(() => {
                    index++;
                    showNext();
                }, 800);
            }, 2000);
        };
        
        showNext();
    }
    
    startCatTimer() {
        let seconds = 10;
        if (!this.catTimer) return;
        
        this.catTimer.textContent = seconds;
        
        this.catInterval = setInterval(() => {
            seconds--;
            if (this.catTimer) {
                this.catTimer.textContent = seconds;
            }
            if (seconds <= 0) {
                clearInterval(this.catInterval);
                setTimeout(() => this.showScreen('book'), 500);
            }
        }, 1000);
    }
    
    setupBook() {
        this.updatePage();
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.updatePage();
                }
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                if (this.currentPage < 8) {
                    this.currentPage++;
                    this.updatePage();
                    
                    if (this.currentPage === 8) {
                        setTimeout(() => this.showScreen('final'), 800);
                    }
                }
            });
        }
        
        // Свайп для телефона
        let touchStart = 0;
        const bookPages = document.getElementById('bookPages');
        
        if (bookPages) {
            bookPages.addEventListener('touchstart', (e) => {
                touchStart = e.touches[0].clientX;
                e.preventDefault();
            });
            
            bookPages.addEventListener('touchend', (e) => {
                const diff = e.changedTouches[0].clientX - touchStart;
                if (Math.abs(diff) > 40) {
                    if (diff < 0 && this.currentPage < 8) {
                        this.currentPage++;
                        this.updatePage();
                        if (this.currentPage === 8) {
                            setTimeout(() => this.showScreen('final'), 800);
                        }
                    } else if (diff > 0 && this.currentPage > 1) {
                        this.currentPage--;
                        this.updatePage();
                    }
                }
            });
        }
    }
    
    updatePage() {
        if (!this.pages || !this.pageCounter) return;
        
        this.pages.forEach(page => page.classList.remove('active'));
        
        const activePage = document.getElementById(`page${this.currentPage}`);
        if (activePage) {
            activePage.classList.add('active');
        }
        
        this.pageCounter.textContent = `${this.currentPage}/7`;
    }
    
    // ===========================================
    // ИСПРАВЛЕННОЕ СЕРДЦЕ
    // ===========================================
    
    createHeartGallery() {
        if (!this.heartCanvas) return;
        
        this.heartCanvas.innerHTML = '';
        
        // Фото для сердца (с 7 по 28)
        const heartPhotos = [
            '7.jpg', '8.jpg', '9.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg',
            '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg', '21.jpg', '22.jpg',
            '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg'
        ];
        
        // Количество фото
        const totalPhotos = 400;
        
        // Создаем массив позиций
        const positions = [];
        
        // Генерируем позиции по формуле сердца
        for (let i = 0; i < totalPhotos; i++) {
            const angle = (i / totalPhotos) * Math.PI * 2;
            
            // Формула сердца
            const x = 16 * Math.pow(Math.sin(angle), 3);
            const y = 13 * Math.cos(angle) - 5 * Math.cos(2*angle) - 2 * Math.cos(3*angle) - Math.cos(4*angle);
            
            // Нормализуем координаты (0-100%)
            const normalizedX = (x + 17) / 34 * 100;
            const normalizedY = (17 - y) / 34 * 100;
            
            positions.push({
                x: normalizedX,
                y: normalizedY,
                angle: angle
            });
        }
        
        // Добавляем дополнительные фото в центр для плотности
        for (let i = 0; i < 50; i++) {
            const centerX = 50 + (Math.random() - 0.5) * 10;
            const centerY = 45 + (Math.random() - 0.5) * 10;
            
            positions.push({
                x: centerX,
                y: centerY,
                angle: Math.random() * Math.PI * 2
            });
        }
        
        // Создаем фото для каждой позиции
        positions.forEach((pos, index) => {
            const img = document.createElement('img');
            img.src = `photos/${heartPhotos[index % heartPhotos.length]}`;
            img.className = 'heart-photo';
            
            img.style.left = pos.x + '%';
            img.style.top = pos.y + '%';
            
            // Случайный поворот
            const rotate = Math.random() * 30 - 15;
            
            // Случайный размер
            const scale = 0.6 + Math.random() * 0.5;
            
            img.style.transform = `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`;
            
            // Анимация
            img.style.animationDelay = (index * 0.01) + 's';
            
            this.heartCanvas.appendChild(img);
        });
    }
}

// Запуск приложения
window.addEventListener('load', () => {
    new App();
});