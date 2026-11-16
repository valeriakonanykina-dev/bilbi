// ==================== 1. Переключатель день/ночь ====================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

themeToggle.addEventListener('click', () => {
    const body = document.body;
    const current = body.getAttribute('data-theme');
    if (current === 'day') {
        body.setAttribute('data-theme', 'night');
        themeIcon.textContent = '☀️';
    } else {
        body.setAttribute('data-theme', 'day');
        themeIcon.textContent = '🌙';
    }
});

// ==================== 2. Эффект печатной машинки ====================
const typewriterText = "Билби — крошечный заяц, который боится всего на свете. Но когда он находит беспомощного птенца, в нём просыпается невероятная смелость. Эта история учит нас тому, что доброта делает нас сильнее, а настоящая семья — это те, кого мы выбираем сами.";
const typewriterEl = document.getElementById('typewriter');
const cursorEl = document.getElementById('cursor');
let charIndex = 0;
let typewriterStarted = false;

function typeWriter() {
    if (charIndex < typewriterText.length) {
        typewriterEl.textContent += typewriterText.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 30);
    } else {
        setTimeout(() => { cursorEl.style.display = 'none'; }, 1500);
    }
}

const ideaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !typewriterStarted) {
            typewriterStarted = true;
            typeWriter();
        }
    });
}, { threshold: 0.3 });

ideaObserver.observe(document.querySelector('.idea'));

// ==================== 3. Мини-игра "Поймай перо" ====================
const gameArea = document.getElementById('gameArea');
const gameStart = document.getElementById('gameStart');
const gameResult = document.getElementById('gameResult');
const resultText = document.getElementById('resultText');
const startGameBtn = document.getElementById('startGame');
const restartGameBtn = document.getElementById('restartGame');
const gameScoreEl = document.getElementById('gameScore');

let score = 0;
let feathersCaught = 0;
let gameInterval = null;
let featherInterval = null;
let gameActive = false;

function startGame() {
    score = 0;
    feathersCaught = 0;
    gameScoreEl.textContent = '0';
    gameStart.style.display = 'none';
    gameResult.style.display = 'none';
    gameArea.style.display = 'block';
    gameActive = true;
    
    document.querySelectorAll('.falling-feather').forEach(f => f.remove());
    
    featherInterval = setInterval(createFeather, 800);
    gameInterval = setTimeout(endGame, 20000);
}

function createFeather() {
    if (!gameActive) return;
    const feather = document.createElement('div');
    feather.className = 'falling-feather';
    feather.textContent = '🪶';
    
    const startX = Math.random() * (gameArea.offsetWidth - 40);
    feather.style.left = startX + 'px';
    feather.style.top = '-40px';
    
    gameArea.appendChild(feather);
    
    let posY = -40;
    const speed = 2 + Math.random() * 2;
    
    const fallInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(fallInterval);
            feather.remove();
            return;
        }
        posY += speed;
        feather.style.top = posY + 'px';
        
        if (posY > gameArea.offsetHeight) {
            clearInterval(fallInterval);
            feather.remove();
        }
    }, 30);
    
    feather.addEventListener('click', () => {
        score++;
        feathersCaught++;
        gameScoreEl.textContent = score;
        feather.style.transform = 'scale(2)';
        feather.style.opacity = '0';
        setTimeout(() => feather.remove(), 200);
        
        if (feathersCaught >= 10) {
            endGame(true);
        }
    });
}

function endGame(won = false) {
    gameActive = false;
    clearInterval(featherInterval);
    clearTimeout(gameInterval);
    
    document.querySelectorAll('.falling-feather').forEach(f => f.remove());
    
    gameArea.style.display = 'none';
    gameResult.style.display = 'block';
    
    if (won || score >= 10) {
        resultText.textContent = `🎉 Отлично! Ты собрал ${score} перьев! Билби гордится тобой!`;
    } else if (score >= 5) {
        resultText.textContent = `👍 Неплохо! ${score} перьев. Билби благодарен!`;
    } else {
        resultText.textContent = `🐰 Собрано ${score} перьев. Попробуй ещё раз!`;
    }
}

startGameBtn.addEventListener('click', startGame);
restartGameBtn.addEventListener('click', () => {
    gameArea.style.display = 'block';
    gameResult.style.display = 'none';
    gameStart.style.display = 'block';
});

// ==================== 4. Карусель ====================
const track = document.getElementById('carouselTrack');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');
let currentSlide = 0;

slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
});

function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
}

prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
});

nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
});

setInterval(() => {
    if (!document.hidden) {
        goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    }
}, 5000);

// ==================== 5. Параллакс при скролле ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const sun = document.getElementById('layerSun');
    if (sun) {
        sun.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});