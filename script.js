// GAME VARIABLES AND CONSTANTS

const SPAWN_POSITION = 580
const DESPAWN_POSITION = 0
const OBSTACLE_WIDTH = 20
let gameSpace = document.getElementById('gameSpace')
let scoreDisplay = document.getElementById('score')
let scoreScreen = document.getElementById('scoreScreen')
let dinosaur = document.getElementById('dinosaur')
document.addEventListener('keydown', keyPressed)
let isPaused = true
let inAction = false
let scoreValue = 0
let dinoLeft = 40

// GAME STATES - START / GAMEOVER

document.addEventListener("visibilitychange", gameOver)

function startGame() {
    obstacleSpawnId = setInterval(createObstacle, 1000)
    obstacleMoveId = setInterval(moveObstacle, 30)
    document.addEventListener('keydown', keyPressed)
    isPaused = false
}

function gameOver() {
    clearInterval(obstacleMoveId)
    clearInterval(obstacleSpawnId)
    document.removeEventListener('keydown', keyPressed)
    isPaused = true
    scoreDisplay.innerHTML = `GAME OVER ! Your final score: ${scoreValue.toFixed(0)}`
    let restart = document.createElement('button')
    restart.innerHTML = 'Restart'
    restart.onclick = restartGame
    scoreScreen.appendChild(restart)
    
}

function restartGame() {
    location.reload()
}

// OBSTACLE CREATION

function createObstacle() {
    let random = Math.floor(Math.random() * 3) + 1 
    let obstacle = document.createElement('div')
    obstacle.classList.add('obstacle');
    if (random === 1) {
        obstacle.style.top = '110px'
        obstacle.style.height = '40px'
    } else if (random === 2) {
        obstacle.style.top = '130px'
        obstacle.style.height = '20px'
    } else {
        obstacle.style.top = '90px'
        obstacle.style.height = '20px'
    }
    obstacle.style.left = '580px';
    obstacle.id = `${(Math.random() * 30).toFixed(5)}`;
    gameSpace.appendChild(obstacle);
}

// GAME UPDATE - MOVEMENT AND COLLISION

function moveObstacle() {
    let obstacles = document.querySelectorAll('.obstacle')
    let dinoTop = dinosaur.style.top.slice(0, -2)
    dinoTop = Number(dinoTop)
    let dinoBottom = dinosaur.style.height.slice(0, -2)
    dinoBottom = dinoTop + Number(dinoBottom)
    let dinoRight = dinosaur.style.width.slice(0, -2)
    dinoRight = dinoLeft + Number(dinoRight)
    obstacles.forEach(function(obstacle) {
        let obstacleLeft = obstacle.style.left.slice(0, -2)
        obstacleLeft = Number(obstacleLeft)
        let obstacleTop = obstacle.style.top.slice(0, -2)
        obstacleTop = Number(obstacleTop)
        let obstacleRight = obstacleLeft + 20
        let obstacleBottom = obstacle.style.height.slice(0, -2)
        obstacleBottom = obstacleTop + Number(obstacleBottom)
        if (obstacleLeft <= dinoRight && obstacleRight >= dinoLeft &&
            obstacleTop <= dinoBottom && obstacleBottom >= dinoTop) {
            gameOver()
        }
        if (obstacleLeft > 0) {
            obstacleLeft -= 5
            obstacle.style.left = `${obstacleLeft}px`
        } else {
            obstacle.remove()
        }
        if (!isPaused){
            scoreValue += 0.5
            scoreDisplay.innerHTML = `Score: ${scoreValue.toFixed(0)}`
        }
    });
}

function keyPressed(e) {
    e.preventDefault()
    if (e.key == 'ArrowUp' && inAction == false) {
        jump()
        inAction = true
    }
    if (e.key == 'ArrowDown' && inAction == false) {
        sneak()
        inAction = true
    }
}

function jump() {
    if (isPaused) {
        dinosaur.style.height = '50px'
        dinosaur.style.width = '30px'
        startGame()
    }
    dinosaur.style.top = '90px'
    setTimeout(function () { dinosaur.style.top = '80px'; }, 30);
    setTimeout(function () { dinosaur.style.top = '60px'; }, 60);
    setTimeout(function () { dinosaur.style.top = '40px'; }, 90);
    setTimeout(function () { dinosaur.style.top = '60px'; }, 840);
    setTimeout(function () { dinosaur.style.top = '80px'; }, 870);
    setTimeout(function () { dinosaur.style.top = '90px'; }, 900);
    setTimeout(function () { dinosaur.style.top = '100px'; inAction = false }, 930);
}

function sneak() {
    dinosaur.style.top = '125px'
    dinosaur.style.height = '25px'
    dinosaur.style.width = '40px'
    setTimeout(function () {dinosaur.style.top = '100px'; dinosaur.style.height = '50px';
                            dinosaur.style.width = '30px'; inAction = false }, 700);
}