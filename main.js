const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');


car.classList.add('car');
start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', startStop);


const keys = {
    'ArrowUp':false,
    'ArrowDown':false,
    'ArrowRight':false,
    'ArrowLeft':false
};

const settings = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 2
};

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}


function startGame() {
    start.classList.add('hide');
    gameArea.innerHTML = '';
    car.style.left = '125px';
    car.style.top = 'auto';
    car.style.bottom = '10px';
    for (let i=0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * settings.traffic); i++) {
        const enemy = document.createElement('div');
        let num = Math.floor(Math.random() * (3 - 1) + 1);
        enemy.classList.add('enemy');
        enemy.y = -100 * settings.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50))+ 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url("./image/enemy${num}.png") center / cover no-repeat`;
        gameArea.appendChild(enemy);
    }

    settings.start = true;
    gameArea.appendChild(car);
    settings.x = car.offsetLeft;
    settings.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {
    moveRoad();
    moveEnemy();
    if (settings.start) {
        settings.score += settings.speed;
        score.innerHTML = 'SCORE:<br>' + settings.score;
        if (keys.ArrowLeft && settings.x > 0) {
            settings.x -= settings.speed;
        }
        if (keys.ArrowRight && settings.x < gameArea.clientWidth - car.offsetWidth) {
            settings.x += settings.speed ;
        }
        if (keys.ArrowUp && settings.y > 0) {
            settings.y -= settings.speed;
        }
        if (keys.ArrowDown && settings.y < gameArea.offsetHeight - car.offsetHeight) {
            settings.y += settings.speed;
        }

        car.style.left = settings.x + 'px';
        car.style.top = settings.y + 'px';

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
        if(carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left &&
        carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top) {
            settings.start = false;
            start.classList.remove('hide');
            start.style.top = score.offsetHeight + 'px';
        }
        enemy.y += settings.speed;
        enemy.style.top = enemy.y + 'px';
        if (enemy.y >= document.documentElement.clientHeight) {
            enemy.y = -100 *settings.traffic;
            enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50))+ 'px';
        }
    });

}