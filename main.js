let score = 0;

const config = {
    step: 0,
    maxStep: 3,
    sizeCell: 30,
    sizeApple: 30 / 2.25
}

const snake = {
    x: 300,
    y: 300,
    dx: 0,
    dy: 0,
    tails: [],
    maxTails: 3,
}

let apple = {
    x: 0,
    y: 0
}

let canvas = document.getElementById('game-canvas');
let context = canvas.getContext('2d');

randomPositionApple();

function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (++config.step < config.maxStep) {
        return
    }
    config.step = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawApple();
    drawSnake();
}
requestAnimationFrame(gameLoop);

function drawSnake() {
    snake.x += snake.dx;
    snake.y += snake.dy;

    snake.tails.unshift({ x: snake.x, y: snake.y });
    if (snake.tails.length > snake.maxTails) {
        snake.tails.pop();
    }

    snake.tails.forEach(function (el, index) {
        context.fillStyle = '#f0f0f0';
        context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

        if (el.x == apple.x && el.y == apple.y) {
            snake.maxTails++;
            incScore();
            randomPositionApple();

        }

        for (let i = index + 1; i < snake.tails.length; i++) {
            if (snake.tails[i].x == snake.x && snake.tails[i].y == snake.y) {
                gameOver();
            }
        }
    });

    collisionBorder();

}

function gameOver() {
    // alert('Game Over');
    // location.reload();
}

function collisionBorder() {
    if (snake.x < 0 || snake.x > canvas.width || snake.y < 0 || snake.y > canvas.height) {
    }
}

function drawApple() {
    context.beginPath();
    context.fillStyle = '#ff0000';
    context.arc(apple.x + (config.sizeCell / 2), apple.y + (config.sizeCell / 2), config.sizeApple, 0, Math.PI * 2);
    context.fill();
}

function randomPositionApple() {
    apple.x = getRandomInt(0, canvas.width / config.sizeCell - 1) * config.sizeCell;
    apple.y = getRandomInt(0, canvas.height / config.sizeCell - 1) * config.sizeCell;
    console.log(`New apple position: x: ${apple.x} y: ${apple.y}`);
}

function incScore() {
    score++;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('keydown', function (event) {
    if (event.code == 'Space' && snake.dx ===0  && snake.dy ===0) {
        snake.dx = config.sizeCell;
        snake.dy = 0;
    }
    else if (event.code == 'ArrowUp' && snake.dy <= 0) {
        snake.dx = 0;
        snake.dy = -config.sizeCell;
    }
    else if (event.code == 'ArrowDown' && snake.dy >= 0) {
        snake.dx = 0;
        snake.dy = config.sizeCell;
    }
    else if (event.code == 'ArrowLeft' && snake.dx <= 0) {
        snake.dx = -config.sizeCell;
        snake.dy = 0;
    }
    else if (event.code == 'ArrowRight' && snake.dx >= 0) {
        snake.dx = config.sizeCell;
        snake.dy = 0;
    }
});