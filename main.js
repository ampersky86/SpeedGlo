const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
car2 = document.createElement('div');

car.classList.add('car');
car2.classList.add('car2');
start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', startStop);


const keys = {
    'ArrowUp':false,
    'ArrowDown':false,
    'ArrowRight':false,
    'ArrowLeft':false
};

const settings ={
    start:false,
    score:0,
    speed:3
};


function startGame() {
    start.classList.add('hide');
    settings.start = true;
    gameArea.appendChild(car);
    gameArea.appendChild(car2);
    requestAnimationFrame(playGame);
}

function playGame() {
    console.log('Play');
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