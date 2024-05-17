// Constants and variables

const SPAWN_POSITION = 580;
const OBSTACLE_WIDTH = 20;
const ANIMATION_DIFF = 30;
let gameSpace = document.getElementById('gameSpace');
let scoreDisplay = document.getElementById('score');
let scoreScreen = document.getElementById('scoreScreen');
let dino = document.querySelector('.dinosaur');
document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyUnpressed);
let isJumping = false;
let sneaking = false;
let isPaused = true;
let canJump = true;
let currentType;
let difficultyId;
let checkCollisionId;
let scoreId;
let dinoLeft = 40;
let difficultySpike = 1.00;
let scoreMultiplier = 50;
let scoreValue = 0;

// Game states

function startGame() {
    document.addEventListener('visibilitychange', gameOver);
    createObstacle();
    scoreId = setInterval(increaseScore, (scoreMultiplier * difficultySpike).toFixed(0));
    checkCollisionId = setInterval(checkCollision, 10);
    difficultyId = setInterval(increaseDifficulty, 3000);
    isPaused = false;
    dino.classList.add('default');
}

function gameOver() {
    clearInterval(checkCollisionId);
    clearInterval(scoreId);
    clearInterval(difficultyId);
    let animatedObject = document.getElementById('obstacle');
    let rect = animatedObject.getBoundingClientRect();
    animatedObject.style.animation = 'none';
    animatedObject.style.left = `${rect.left - ANIMATION_DIFF}px`;
    document.removeEventListener('visibilitychange', gameOver);
    document.removeEventListener('keydown', keyPressed);
    isPaused = true;
    scoreDisplay.innerHTML = `GAME OVER ! Your final score: ${scoreValue.toFixed(0)}`;
    let restart = document.createElement('button');
    restart.innerHTML = 'Restart';
    restart.onclick = restartGame;
    scoreScreen.appendChild(restart);
}

function restartGame() {
    location.reload();
}

// Game logic and updates

function createObstacle() {
    let random = Math.floor(Math.random() * 3) + 1;
    let obstacle = document.createElement('div');
    obstacle.classList.add(`obstacle${random}`);
    currentType = random;
    obstacle.id = 'obstacle';
    obstacle.style.animation = `move ${difficultySpike * 4}s linear infinite`;
    gameSpace.appendChild(obstacle);
    obstacle.addEventListener('animationiteration', function() {
        obstacle.style.animation = 'none';
        random = Math.floor(Math.random() * 3) + 1;
        obstacle.classList.remove(`obstacle${currentType}`);
        obstacle.classList.add(`obstacle${random}`);
        currentType = random;
        void obstacle.offsetWidth;
        obstacle.style.animation = `move ${difficultySpike * 4}s linear infinite`;
    });
}

function checkCollision() {
    let obstacle = document.querySelector('#obstacle');
    let obstaclePos = obstacle.getBoundingClientRect();
    let dinoPos = dino.getBoundingClientRect();
    if (obstaclePos.left <= dinoPos.right &&
        obstaclePos.right >= dinoPos.left &&
        obstaclePos.bottom >= dinoPos.top &&
        obstaclePos.top <= dinoPos.bottom) {
        gameOver();
    }
}

function increaseScore() {
    scoreValue += 0.2;
    scoreDisplay.textContent = `Score : ${scoreValue.toFixed(0)}`;
}

function increaseDifficulty() {
    if (difficultySpike > 0.5) {
        difficultySpike -= 0.05;
        clearInterval(scoreId);
        scoreId = setInterval(increaseScore, (scoreMultiplier * difficultySpike).toFixed(0));
    }
}

// User input and dinosaur style changes

function keyPressed(e) {
    if (e.key === 'ArrowUp' && !isJumping) {
        jump();
    }
    if (e.key === 'ArrowDown') {
        sneaking = true;
        sneak();
    }
}

function keyUnpressed(e) {
    e.preventDefault();
    if (e.key === 'ArrowUp') {
        canJump = true;
    }
    if (e.key === 'ArrowDown') {
        sneaking = false;
        resetDino();
    }
}

function jump() {
    if (isPaused) {
        startGame();
    }
    isJumping = true;
    dino.style.animation = 'none';
    setTimeout(() => {
        dino.style.animation = 'jump 1s ease';
    }, 100);
    setTimeout(() => {
        isJumping = false;
    }, 500);
}

function sneak() {
    if (!isJumping) {
        dino.classList.remove('default');
        dino.classList.add('sneak');
    }
}

function resetDino() {
    dino.classList.remove('sneak');
    dino.classList.add('default');
}