// GAME VARIABLES AND CONSTANTS

const SPAWN_POSITION = 580
const DESPAWN_POSITION = 0
const OBSTACLE_WIDTH = 20
const FLOOR_LEVEL = 100
const MAX_JUMP = 60
const FALL_SPEED = 2.5
let gameSpace = document.getElementById('gameSpace')
let scoreDisplay = document.getElementById('score')
let scoreScreen = document.getElementById('scoreScreen')
let dino = document.querySelector('#dinosaur')
let dinoStyle = window.getComputedStyle(dino)
document.addEventListener('keydown', keyPressed)
document.addEventListener('keyup', keyUnpressed)
let isJumping = false
let sneaking = false
let isPaused = true
let isFalling = false
let canJump = true
let jumpInterval
let gravityInterval
let obstacleMoveId
let obstacleSpawnId
let jumpTimeout
let difficultyId
let scoreId
let difficultySpike = 1.00
let spawnRate = 1500
let scoreAndMotion = 30
let jumpHeight = 0
let scoreValue = 0
let dinoLeft = 40
resetDino()

// GAME STATES - START / GAMEOVER

let changedTab = document.addEventListener('visibilitychange', gameOver)

function startGame() {
    obstacleSpawnId = setInterval(createObstacle, (spawnRate * difficultySpike).toFixed(0))
    obstacleMoveId = setInterval(moveObstacle, (scoreAndMotion * difficultySpike).toFixed(0))
    scoreId = setInterval(increaseScore, (scoreAndMotion * difficultySpike).toFixed(0))
    checkCollisionId = setInterval(checkCollision, 10)
    difficultyId = setInterval(increaseDifficulty, 3000)
    document.addEventListener('keydown', keyPressed)
    isPaused = false
}

function gameOver() {
    clearInterval(obstacleMoveId)
    clearInterval(obstacleSpawnId)
    clearInterval(checkCollisionId)
    clearInterval(gravityInterval)
    clearInterval(scoreId)
    clearInterval(difficultyId)
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
    obstacle.classList.add(`obstacle${random}`)
    obstacle.classList.add('obstacle')
    obstacle.id = `${(Math.random() * 30).toFixed(5)}`
    gameSpace.appendChild(obstacle)
}

// GAME UPDATE - MOVEMENT AND COLLISION

function moveObstacle() {
    let obstacles = document.querySelectorAll('.obstacle')
    obstacles.forEach(function(obstacle) {
        let obstacleStyle = window.getComputedStyle(obstacle)
        let obstacleLeft = parseInt(obstacleStyle.getPropertyValue('left'))
        if (obstacleLeft > 0) {
            obstacleLeft -= 5
            obstacle.style.left = `${obstacleLeft}px`
        } else {
            obstacle.remove()
        }
    })
}

function checkCollision() {
    let obstacles = document.querySelectorAll('.obstacle')
    let dinoTop = parseInt(dinoStyle.getPropertyValue('top'))
    let dinoHeight = parseInt(dinoStyle.getPropertyValue('height'))
    let dinoBottom = dinoTop + dinoHeight
    let dinoRight = parseInt(dinoStyle.getPropertyValue('width')) + dinoLeft
    obstacles.forEach(function(obstacle) {
        let obstacleStyle = window.getComputedStyle(obstacle)
        let obstacleLeft = parseInt(obstacleStyle.getPropertyValue('left'))
        let obstacleHeight = parseInt(obstacleStyle.getPropertyValue('height'))
        let obstacleRight = obstacleLeft + OBSTACLE_WIDTH
        let obstacleTop = parseInt(obstacleStyle.getPropertyValue('top'))
        let obstacleBottom = obstacleTop + obstacleHeight
        if (obstacleLeft <= dinoRight && obstacleRight >= dinoLeft &&
            obstacleBottom >= dinoTop && obstacleTop <= dinoBottom) {
            gameOver()
        }
    })
}

function increaseScore() {
    scoreValue += 0.2
    scoreDisplay.textContent = `Score : ${scoreValue.toFixed(0)}`
}

function increaseDifficulty() {
    if (difficultySpike > 0.1) {
        difficultySpike -= 0.05
        clearInterval(obstacleMoveId)
        clearInterval(obstacleSpawnId)
        clearInterval(scoreId)
        obstacleSpawnId = setInterval(createObstacle, (spawnRate * difficultySpike).toFixed(0))
        obstacleMoveId = setInterval(moveObstacle, (scoreAndMotion * difficultySpike).toFixed(0))
        scoreId = setInterval(increaseScore, (scoreAndMotion * difficultySpike).toFixed(0))
    }
}

function keyPressed(e) {
    e.preventDefault()
    if (!isJumping && e.key === 'ArrowUp' && parseInt(dinoStyle.getPropertyValue('top')) >= 100) {
        isJumping = true
        jump()
    }
    if (e.key === 'ArrowDown') {
        sneaking = true
        sneak()
    }
}

function keyUnpressed(e) {
    e.preventDefault()
    if (e.key === 'ArrowUp') {
        clearInterval(jumpInterval)
        startGravity()
        canJump = true
    }
    if (e.key === 'ArrowDown') {
        sneaking = false
        resetDino()
    }
}

function jump() {
    if (!sneaking && canJump) {
        if (isPaused) {
            startGame()
        }
        jumpInterval = setInterval(function() {
            if (jumpHeight < MAX_JUMP) {
                let dinoTop = parseInt(dinoStyle.getPropertyValue('top'))
                dinoTop -= 5
                dino.style.top = `${dinoTop}px`
                jumpHeight += 5
                isFalling = false
            } else {
                clearInterval(jumpInterval)
                if (!isFalling) {
                    isFalling = true
                    jumpTimeout = setTimeout(startGravity, 600)
                }
                jumpHeight = 0
            }
        }, 20)
    }
}

function startGravity() {
    isJumping = false
    isFalling = true
    canJump = false
    let gravityInterval = setInterval(function() {
        let dinoTop = parseInt(dino.style.top)
        if (!isJumping && dinoTop < FLOOR_LEVEL) {
            dinoTop += FALL_SPEED * 3
            dino.style.top = `${dinoTop}px`
        } else {
            clearInterval(gravityInterval)
            clearTimeout(jumpTimeout)
            jumpHeight = 0
        }
        if (dinoTop >= FLOOR_LEVEL) {
            dino.removeAttribute('style')
        }
    }, 10)
}

function sneak() {
    if (parseInt(dinoStyle.getPropertyValue('top')) == FLOOR_LEVEL) {
        dino.classList.remove("default")
        dino.classList.add("sneak")
    }
}

function resetDino() {
    dino.classList.remove("sneak")
    dino.classList.add("default")
}