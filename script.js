// GAME VARIABLES AND CONSTANTS

const SPAWN_POSITION = 580
const DESPAWN_POSITION = 0
const OBSTACLE_WIDTH = 20
let gameSpace = document.getElementById('gameSpace')
let scoreDisplay = document.getElementById('score')
let scoreScreen = document.getElementById('scoreScreen')
let dino = document.getElementById('dinosaur')
document.addEventListener('keydown', keyPressed)
document.addEventListener('keyup', keyUnpressed)
let isJumping = false
let sneaking = false
let scoreValue = 0
let dinoLeft = 40
let isPaused = true
let jumpInterval
let jumpHeight = 0
let obstacleMoveId
resetDino()

// GAME STATES - START / GAMEOVER

let changedTab = document.addEventListener('visibilitychange', gameOver)

function startGame() {
    obstacleSpawnId = setInterval(createObstacle, 1000)
    obstacleMoveId = setInterval(moveObstacle, 30)
    document.addEventListener('keydown', keyPressed)
    isPaused = false
}

function gameOver() {
    clearInterval(obstacleMoveId)
    clearInterval(obstacleSpawnId)
    document.removeEventListener('visibilitychange', gameOver)
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
    obstacle.classList.add('obstacle')
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
    obstacle.style.left = '580px'
    obstacle.id = `${(Math.random() * 30).toFixed(5)}`
    gameSpace.appendChild(obstacle)
}

// GAME UPDATE - MOVEMENT AND COLLISION

function moveObstacle() {
    let obstacles = document.querySelectorAll('.obstacle')
    let dinoTop = dino.style.top.slice(0, -2)
    dinoTop = Number(dinoTop)
    let dinoBottom = dino.style.height.slice(0, -2)
    dinoBottom = dinoTop + Number(dinoBottom)
    let dinoRight = dino.style.width.slice(0, -2)
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
        scoreValue += 0.5
        scoreDisplay.innerHTML = `Score: ${scoreValue.toFixed(0)}`
    })
}

function keyPressed(e) {
    e.preventDefault()
    if (!isJumping && e.key === 'ArrowUp' && parseInt(dino.style.top) >= 100) {
        isJumping = true
        jump()
    }
    if (e.key === 'ArrowDown' && !sneaking) {
        sneaking = true
        sneak()
    }
}

function keyUnpressed(e) {
    e.preventDefault()
    if (e.key === 'ArrowUp') {
        clearInterval(jumpInterval)
        startGravity()
        isJumping = false
    }
    if (e.key === 'ArrowDown') {
        sneaking = false
        resetDino()
    }
}

function jump() {
    if (isPaused) {
        startGame()
    }
    jumpInterval = setInterval(function() {
        if (jumpHeight < 60) {
            let dinoTop = parseInt(dino.style.top)
            dinoTop -= 5
            dino.style.top = `${dinoTop}px`
            jumpHeight += 5
        } else {
            clearInterval(jumpInterval)
            startGravity()
            jumpHeight = 0
        }
    }, 20)
}

function startGravity() {
    const gravityInterval = setInterval(function() {
        let dinoTop = parseInt(dino.style.top)
        if (!isJumping && dinoTop < 100) {
            dinoTop += 2.5
            dino.style.top = `${dinoTop}px`
        } else {
            clearInterval(gravityInterval)
            jumpHeight = 0
        }
    }, 10)
}

function sneak() {
    dino.style.height = '30px'
    dino.style.width = '45px'
    dino.style.top = '120px'
}

function resetDino() {
    dino.style.top = '100px'
    dino.style.height = '50px'
    dino.style.width = '30px'
}