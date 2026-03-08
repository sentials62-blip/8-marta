class App {
    constructor() {
        // Экраны
        this.screens = {
            qr: document.getElementById('qrScreen'),
            timer: document.getElementById('timerScreen'),
            greeting: document.getElementById('greetingScreen'),
            cat: document.getElementById('catScreen'),
            book: document.getElementById('bookScreen'),
            heart: document.getElementById('heartScreen')
        };
        
        // Элементы
        this.timerDisplay = document.getElementById('timerDisplay');
        this.wordsContainer = document.getElementById('wordsContainer');
        this.catTimer = document.getElementById('catTimer');
        this.realBook = document.getElementById('realBook');
        this.prevBtn = document.getElementById('prevPage');
        this.nextBtn = document.getElementById('nextPage');
        this.pageNumber = document.getElementById('pageNumber');
        this.heartCanvas = document.getElementById('heartCanvas');
        
        // Переменные
        this.currentScreen = 'qr';
        this.timerInterval = null;
        this.catInterval = null;
        this.currentPage = 0;
        this.totalPages = 4;
        this.bookLeaves = document.querySelectorAll('.book-leaf');
        
        this.init();
    }
    
    init() {
        this.createFloatingHearts();
        this.showScreen('qr');
        this.setupQRAutoAdvance();
        this.setupBookControls();
    }
    
    createFloatingHearts() {
        const container = document.getElementById('floatingHearts');
        if (!container) return;
        
        const hearts = ['❤️', '💕', '💖', '💗', '💓', '💘', '💝'];
        
        setInterval(() => {
            for (let i = 0; i < 2; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart-float';
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                
                heart.style.left = Math.random() * 100 + '%';
                heart.style.fontSize = (20 + Math.random() * 30) + 'px';
                heart.style.animationDuration = (6 + Math.random() * 6) + 's';
                heart.style.opacity = 0.1 + Math.random() * 0.2;
                
                container.appendChild(heart);
                
                setTimeout(() => heart.remove(), 12000);
            }
        }, 300);
    }
    
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
        
        if (screenName === 'timer') this.startTimer();
        if (screenName === 'greeting') this.showWords();
        if (screenName === 'cat') this.startCatTimer();
        if (screenName === 'heart') {
            this.createHeartFromPhotos();
            this.animateHeart();
        }
    }
    
    setupQRAutoAdvance() {
        setTimeout(() => {
            this.showScreen('timer');
        }, 4000);
    }
    
    startTimer() {
        let count = 3;
        if (!this.timerDisplay) return;
        
        this.timerInterval = setInterval(() => {
            count--;
            
            if (count > 0) {
                this.timerDisplay.textContent = count;
                this.createSparkle(8);
            } else {
                clearInterval(this.timerInterval);
                this.createSparkle(20);
                setTimeout(() => {
                    this.showScreen('greeting');
                }, 500);
            }
        }, 1000);
    }
    
    startCatTimer() {
        let seconds = 10;
        if (!this.catTimer) return;
        
        this.catTimer.textContent = seconds;
        
        this.catInterval = setInterval(() => {
            seconds--;
            this.catTimer.textContent = seconds;
            
            if (seconds <= 0) {
                clearInterval(this.catInterval);
                this.createSparkle(30);
                setTimeout(() => {
                    this.showScreen('book');
                }, 500);
            }
        }, 1000);
    }
    
    showWords() {
        const words = ['💫', 'с', '8', 'марта', '❤️', 'любимая'];
        if (!this.wordsContainer) return;
        
        this.wordsContainer.innerHTML = '';
        
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = word;
            this.wordsContainer.appendChild(span);
            
            setTimeout(() => {
                span.classList.add('visible');
                this.createSparkle(5);
            }, index * 250);
        });
        
        setTimeout(() => {
            this.showScreen('cat');
        }, words.length * 250 + 1500);
    }
    
    createSparkle(count = 5) {
        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'absolute';
            sparkle.style.left = '50%';
            sparkle.style.top = '50%';
            sparkle.style.fontSize = (20 + Math.random() * 20) + 'px';
            sparkle.style.zIndex = '9999';
            sparkle.style.pointerEvents = 'none';
            sparkle.textContent = ['✨', '💫', '⭐', '🌸', '✨'][Math.floor(Math.random() * 5)];
            sparkle.style.color = '#ffc0cb';
            
            document.body.appendChild(sparkle);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 150;
            
            sparkle.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 1500,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            });
            
            setTimeout(() => sparkle.remove(), 1500);
        }
    }
    
    setupBookControls() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        this.prevBtn.addEventListener('click', () => this.prevPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        
        let touchStartX = 0;
        
        if (this.realBook) {
            this.realBook.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            });
            
            this.realBook.addEventListener('touchend', (e) => {
                const diff = e.changedTouches[0].clientX - touchStartX;
                if (Math.abs(diff) > 40) {
                    if (diff < 0) this.nextPage();
                    else this.prevPage();
                }
            });
        }
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.updateBookPages();
            this.createSparkle(6);
        } else {
            this.createSparkle(30);
            setTimeout(() => {
                this.showScreen('heart');
            }, 500);
        }
    }
    
    prevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updateBookPages();
            this.createSparkle(4);
        }
    }
    
    updateBookPages() {
        if (!this.bookLeaves || !this.pageNumber) return;
        
        if (this.currentPage === 0) {
            this.bookLeaves[0].style.transform = 'rotateY(0deg)';
            this.bookLeaves[1].style.transform = 'rotateY(0deg)';
        } else if (this.currentPage === 1) {
            this.bookLeaves[0].style.transform = 'rotateY(-180deg)';
            this.bookLeaves[1].style.transform = 'rotateY(0deg)';
        } else if (this.currentPage === 2) {
            this.bookLeaves[0].style.transform = 'rotateY(-180deg)';
            this.bookLeaves[1].style.transform = 'rotateY(-180deg)';
        }
        
        this.pageNumber.textContent = `${this.currentPage + 1}/${this.totalPages}`;
    }
    
    // ========== НОВЫЙ КОД ДЛЯ ФОТО В ФОРМЕ СЕРДЦА ==========
    
    createHeartFromPhotos() {
        if (!this.heartCanvas) return;
        
        this.heartCanvas.innerHTML = '';
        
        // Количество фото в сердце
        const photoCount = 250;
        
        // СПИСОК ТВОИХ ФОТО - ДОБАВЬ СЮДА ВСЕ СВОИ ФАЙЛЫ
        const photoFiles = [
            '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg',
            '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'
            // Добавь столько, сколько есть фото
        ];
        
        // Рассчитываем позиции для сердца
        const positions = this.calculateHeartPositions(photoCount);
        
        // Создаем фото
        for (let i = 0; i < photoCount; i++) {
            const img = document.createElement('img');
            
            // Берем фото по очереди
            const photoIndex = i % photoFiles.length;
            img.src = `photos/${photoFiles[photoIndex]}`;
            
            img.className = 'heart-photo';
            
            const pos = positions[i];
            img.style.left = pos.x + '%';
            img.style.top = pos.y + '%';
            img.style.width = '70px';
            img.style.height = '70px';
            img.style.transform = `translate(-50%, -50%) rotate(${pos.rotate}deg) scale(${pos.scale})`;
            img.style.animationDelay = (i * 0.02) + 's';
            img.style.borderRadius = '15px';
            img.style.objectFit = 'cover';
            img.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
            img.style.border = '3px solid white';
            img.style.position = 'absolute';
            img.style.transition = 'all 0.3s ease';
            
            // Эффект при наведении
            img.addEventListener('mouseenter', () => {
                img.style.transform = `translate(-50%, -50%) rotate(${pos.rotate}deg) scale(1.5)`;
                img.style.zIndex = '1000';
                img.style.boxShadow = '0 0 30px rgba(255,192,203,0.8)';
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.transform = `translate(-50%, -50%) rotate(${pos.rotate}deg) scale(${pos.scale})`;
                img.style.zIndex = 'auto';
                img.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
            });
            
            this.heartCanvas.appendChild(img);
        }
    }
    
    calculateHeartPositions(count) {
        const positions = [];
        
        for (let i = 0; i < count; i++) {
            // Математическая формула сердца
            const t = (i / count) * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
            
            // Масштабируем под экран
            const normalizedX = (x + 17) / 34 * 100;
            const normalizedY = (17 - y) / 34 * 100;
            
            // Добавляем небольшой разброс для естественности
            const spread = 2;
            const jitterX = (Math.random() - 0.5) * spread;
            const jitterY = (Math.random() - 0.5) * spread;
            
            positions.push({
                x: Math.min(98, Math.max(2, normalizedX + jitterX)),
                y: Math.min(98, Math.max(2, normalizedY + jitterY)),
                rotate: (Math.random() - 0.5) * 15,
                scale: 0.7 + Math.random() * 0.4
            });
        }
        
        return positions;
    }
    
    animateHeart() {
        // Не нужна отдельная анимация, фото уже двигаются через CSS
    }
}

// Запуск приложения
window.addEventListener('load', () => {
    new App();
});