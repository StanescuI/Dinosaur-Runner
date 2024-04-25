// GAME VARIABLES AND CONSTANTS

// I need the left position of gamespace, and the right border for spawns
// I need the score
const RIGHT_BORDER = 600
const LEFT_BORDER = 0
const OBJECT_WIDTH = 30
const COLLIDING_AREA = 70
let gameSpace = document.getElementById('gameSpace')
let scoreDisplay = document.getElementById('score')
let isPaused = true
let inAction = false
let scoreValue = 0
let obstacleWidth = 20
let dinosaur = document.createElement('div')
dinosaur.style.top = '100px'
dinosaur.style.left = '40px'
dinosaur.style.height = '50px'
dinosaur.style.width = '30px'
dinosaur.id = 'dinosaur'
gameSpace.appendChild(dinosaur)
dinosaur = document.getElementById('dinosaur')
let dinoLeft = 40
// OBSTACLE CREATION

function createObstacle() {
    // let random = Math.floor(Math.random() * 3) + 1 
    let obstacle = document.createElement('div')
    obstacle.classList.add('obstacle');
    // if (random === 1) {
        obstacle.style.left = '580px'
        obstacle.style.top = '110px'
        obstacle.style.height = '40px'
    // } else if (random === 2) {
    //     obstacle.style.left = '580px'
    //     obstacle.style.top = '130px'
    //     obstacle.style.height = '20px'
    // } else {
    //     obstacle.style.left = '580px'
    //     obstacle.style.top = '90px'
    //     obstacle.style.height = '20px'
    // }
    // obstacle.id = `${(Math.random() * 30).toFixed(3)}`;
    gameSpace.appendChild(obstacle);
}

// GAME UPDATE - MOVEMENT AND COLLISION

function jump() {
    setTimeout(function () { dinosaur.style.top = '90px'; }, 10);
    setTimeout(function () { dinosaur.style.top = '80px'; }, 40);
    setTimeout(function () { dinosaur.style.top = '60px'; }, 70);
    setTimeout(function () { dinosaur.style.top = '40px'; }, 100);
    setTimeout(function () { dinosaur.style.top = '60px'; }, 870);
    setTimeout(function () { dinosaur.style.top = '80px'; }, 900);
    setTimeout(function () { dinosaur.style.top = '90px'; }, 930);
    setTimeout(function () { dinosaur.style.top = '100px'; inAction = false }, 960);
}

function sneak() {
    setTimeout(function () {dinosaur.style.top = '125px'; dinosaur.style.height = '25px';
                            dinosaur.style.width = '40px' }, 10);
    setTimeout(function () {dinosaur.style.top = '100px'; dinosaur.style.height = '50px';
                            dinosaur.style.width = '30px'; inAction = false }, 700);
}
// function that checks if an object collides with the dinosau

// GAME STATES - PAUSE / GAMEOVER / START

// I need a pause which pauses the intervals and stops keydown listeners, and the score
// the gameover function that pauses the game and shows score
function pauseGame() {
    if (!isPaused) {
        clearInterval(obstacleMoveId)
        clearInterval(obstacleSpawnId)
        document.removeEventListener('keydown', keyPressed)
        isPaused = true
    } else {
        obstacleSpawnId = setInterval(createObstacle, 1000)
        obstacleMoveId = setInterval(moveObstacle, 30)
        document.addEventListener('keydown', keyPressed)
        isPaused = false
    }
}

function pauseTheGame() {
    clearInterval(obstacleMoveId)
        clearInterval(obstacleSpawnId)
        document.removeEventListener('keydown', keyPressed)
        isPaused = true
}

function startGame() {
    // the dinosaur is created and setinterval for obstacles and addeventlistener
    
    pauseGame()
}

document.addEventListener("visibilitychange", pauseTheGame)

// pauseTheGame() {
//     if (document.visibilityState == 'hidden' && !isPaused) {

//     }
// }

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

function moveObstacle() {
    let dinoTop = parseInt(dinosaur.style.top)
    let dinoBottom = parseInt(dinosaur.style.top) + parseInt(dinosaur.style.height)
    let dinoRight = dinoLeft + parseInt(dinosaur.style.width)
    let obstacles = document.querySelectorAll('.obstacle')
    obstacles.forEach(function(obstacle) {
        let obstacleLeft = parseInt(obstacle.style.left)
        let obstacleTop = parseInt(obstacle.style.top)
        let obstacleRight = obstacleLeft + parseInt(obstacle.style.width)
        let obstacleBottom = obstacleTop + parseInt(obstacle.style.height)
        if (obstacleLeft <= dinoRight && obstacleRight >= dinoLeft &&
            obstacleBottom <= dinoTop && obstacleTop >= dinoBottom) {
            console.log('hit')
            console.log('gameOver');
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

