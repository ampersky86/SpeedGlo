const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');

car.classList.add('car');
start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', startStop);

let topScore = localStorage.getItem('topScore');

let allow = false;
const audio = new Audio();
audio.src = './sound/GTA.mp3';
audio.addEventListener('loadeddata', () => {
    allow = true;
    console.log('Аудио загружено');
});

const keys = {
    'ArrowUp': false,
    'ArrowDown': false,
    'ArrowRight': false,
    'ArrowLeft': false
};

const settings = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 2,
    level: 0
};

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

function startGame(event) {
    if (event.target.classList.contains('easy')) {
        settings.speed = 3;
        settings.traffic = 3;
    }
    if (event.target.classList.contains('middle')) {
        settings.speed = 5;
        settings.traffic = 2;
    }
    if (event.target.classList.contains('hard')) {
        settings.speed = 7;
        settings.traffic = 2;
    }
    start.classList.add('hide');
    gameArea.innerHTML = '';
    car.style.left = '125px';
    car.style.top = 'auto';
    car.style.bottom = '10px';
    // Создание дорожной полосы
    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }
    // Создание вражеских машин
    for (let i = 0; i < getQuantityElements(100 * settings.traffic); i++) {
        const enemy = document.createElement('div');
        let num = Math.floor(Math.random() * (3 - 1) + 1);
        enemy.classList.add('enemy');
        enemy.y = -100 * settings.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url("./image/enemy${num}.png") center / cover no-repeat`;
        gameArea.appendChild(enemy);
    }
    if (allow) {
        audio.play();
    }
    settings.score = 0;
    settings.start = true;
    gameArea.appendChild(car);
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {
    if (settings.score > 2000 && settings.level === 0) {
        ++settings.speed;
        ++settings.level;
    } else if (settings.score > 5000 && settings.level === 1) {
        ++settings.speed;
        ++settings.level;
    } else if (settings.score > 10000 && settings.level === 2) {
        ++settings.speed;
        ++settings.level;
    }
    moveRoad();
    moveEnemy();
    settings.score += settings.speed;
    score.innerHTML = 'SCORE:<br>' + settings.score;
    if (keys.ArrowLeft && settings.x > 0) {
        settings.x -= settings.speed;
    }
    if (keys.ArrowRight && settings.x < gameArea.clientWidth - car.offsetWidth) {
        settings.x += settings.speed;
    }
    if (keys.ArrowUp && settings.y > 0) {
        settings.y -= settings.speed;
    }
    if (keys.ArrowDown && settings.y < gameArea.offsetHeight - car.offsetHeight) {
        settings.y += settings.speed;
    }

    car.style.left = settings.x + 'px';
    car.style.top = settings.y + 'px';
    if (settings.start) {
        requestAnimationFrame(playGame);
    }
}

function startRun(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function startStop(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach((item) => {
        item.y += settings.speed;
        item.style.top = item.y + 'px';
        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100;
        }
    });
}

function moveEnemy() {
    let enemys = document.querySelectorAll('.enemy');
    enemys.forEach((enemy) => {
        let carRect = car.getBoundingClientRect();
        let enemyRect = enemy.getBoundingClientRect();
        if (carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top) {
            settings.start = false;
            start.classList.remove('hide');
            start.style.top = score.offsetHeight + 'px';
            audio.pause();
            if (topScore < settings.score) {
                localStorage.setItem('topScore', settings.score);
            }
        }
        enemy.y += settings.speed;
        enemy.style.top = enemy.y + 'px';
        if (enemy.y >= document.documentElement.clientHeight) {
            enemy.y = -100 * settings.traffic;
            enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });

}