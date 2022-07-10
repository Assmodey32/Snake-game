// Configuration
const config = {
  speed: 200, // ms per tile
  sizeCell: 30,
  sizeApple: 30 / 2.25,
}


// Game data
const snake = {
  x: 300,
  y: 300,
  dx: 0,
  dy: 0,
  tails: [{
    x: 300,
    y: 300
  }, {
    x: 270,
    y: 300
  }, {
    x: 240,
    y: 300
  }],
  maxTails: 3,
}

let apple = {
  x: 0,
  y: 0
}

let startTimestamp; // The starting timestamp of the animation
let lastTimestamp; // The previous timestamp of the animation
let stepsTaken; // How many steps did the snake take
let score = 0;

let inputs = []; // A list of inputs the snake still has to take in order

let gameStarted = false;

let canvas = document.getElementById('game-canvas');
let context = canvas.getContext('2d');

gameReset();

function gameReset() {
  snake.x = 300;
  snake.y = 300;
  snake.dx = 0;
  snake.dy = 0;
  snake.tails = [{
    x: 300,
    y: 300
  }, {
    x: 270,
    y: 300
  }, {
    x: 240,
    y: 300
  }];
  snake.maxTails = 3;
  stepsTaken = -1;
  score = 0;

  randomPositionApple();

  // Reset inputs
  inputs = [];
}

function gameStart() {
  // gameReset();
  config.gameStarted = true;
  then = Date.now();
  gameLoop();
}

function updateDebugInfo() {
  document.getElementById('score').innerHTML = score;
  document.getElementById('dx').innerHTML = snake.dx;
  document.getElementById('dy').innerHTML = snake.dy;
  document.getElementById('x').innerHTML = snake.x;
  document.getElementById('y').innerHTML = snake.y;
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

function addNewApple() {
  let onSnake = false;
  do {
    randomPositionApple();
    snake.tails.forEach(function (tail) {
      if (tail.x == apple.x && tail.y == apple.y) {
        onSnake = true;
      }
    });
  }
  while (onSnake);
}


function incScore() {
  score++;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('keydown', function (event) {

  if (![' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key))
    return;

  event.preventDefault();


  let lastDirection = inputs[inputs.length - 1];

  if (event.key == ' ') {
    gameReset();
    startGame();
    return;
  }

  if (event.key == 'ArrowUp' && snake.dy <= 0 && lastDirection !== 'Up') {
    inputs.push('Up');
    if (!gameStarted) startGame();
    return;
  }
  if (event.key == 'ArrowDown' && snake.dy >= 0 && lastDirection !== 'Down') {
    inputs.push('Down');
    if (!gameStarted) startGame();
    return;
  }
  if (event.key == 'ArrowLeft' && snake.dx <= 0 && lastDirection !== 'Left') {
    inputs.push('Left');
    if (!gameStarted) startGame();
    return;
  }
  if (event.key == 'ArrowRight' && snake.dx >= 0 && lastDirection !== 'Right') {
    inputs.push('Right');
    if (!gameStarted) startGame();
    return;
  }
});

function startGame() {
  gameStarted = true;
  window.requestAnimationFrame(gameLoop);
  console.log('Game started');
}

function gameLoop(timestamp) {

  try {
    if (startTimestamp === undefined)
      startTimestamp = timestamp;

    const totalElapsedTime = timestamp - startTimestamp;

    const stepsShouldHaveTaken = Math.floor(totalElapsedTime / config.speed);
    const percentageOfStep = (totalElapsedTime % speed) / speed;

    if (stepsTaken !== stepsShouldHaveTaken) {
      stepAndTransition(percentageOfStep);
      updateDebugInfo();

      if (snake.x === apple.x && snake.y === apple.y) {

        // Snake grew
        snake.maxTails++;
        // increase score

        incScore();

        // Generate new apple
        addNewApple();
      }
      stepsTaken++;
    } else {
      transition(percentageOfStep);
    }

    drawApple();

    window.requestAnimationFrame(gameLoop);
  } catch (error) {

  }
}

function drawRect(x, y, width, height) {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}

function stepAndTransition(percentageOfStep) {
  const newHeadPosition = getNextPosition();
  snake.tails.unshift(newHeadPosition);

  if (newHeadPosition != apple) {
    snake.tails.pop();

    const tail = snake.tails[snake.tails.length - 1];
    drawTail(tail, percentageOfStep)

    for (let i = 1; i < snake.tails.length - 1; i++) {
      drawRect(snake.tails[i].x, snake.tails[i].y, config.sizeCell, config.sizeCell);
    }

    const head = newHeadPosition;
    drawHead(head, percentageOfStep)
  }
}

function drawHead(head, percentageOfStep) {
  const headDir = headDirection();
  const headValue = (percentageOfStep) * config.sizeCell;

  if (headDir == 'Up') {
    drawRect(head.x, head.y + headValue, config.sizeCell, headValue);
  } else if (headDir == 'Down') {
    drawRect(head.x, head.y, config.sizeCell, headValue);
  } else if (headDir == 'Left') {
    drawRect(head.x + headValue, head.y, headValue, config.sizeCell);
  } else if (headDir == 'Right') {
    drawRect(head.x, head.y, headValue, config.sizeCell);
  }
}

function drawTail(tail, percentageOfStep) {
  const tailDir = tailDirection();
  const tailValue = (1 - percentageOfStep) * config.sizeCell;

  if (tailDir == 'Up') {
    drawRect(tail.x, tail.y, config.sizeCell, tailValue);
  } else if (tailDir == 'Down') {
    drawRect(tail.x, tail.y + tailValue, config.sizeCell, tailValue);
  } else if (tailDir == 'Left') {
    drawRect(tail.x, tail.y, tailValue, config.sizeCell);
  } else if (tailDir == 'Right') {
    drawRect(tail.x + tailValue, tail.y, tailValue, config.sizeCell);
  }
}

function transition(percentageOfStep) {
  const head = snake.tails[0];
  drawHead(head, percentageOfStep);

  const tail = snake.tails[snake.tails.length - 1];
  drawTail(tail, percentageOfStep);
}

function headDirection() {
  let head = snake.tails[0];
  let second = snake.tails[1];
  return getDirection(head, second)
}

function tailDirection() {
  let tail = snake.tails[snake.tails.length - 1];
  let second = snake.tails[snake.tails.length - 2];
  return getDirection(tail, second)
}

function getDirection(first, second) {
  if (first.x - second.x < 0) {
    return 'Left';
  }
  if (first.x - second.x > 0) {
    return 'Right';
  }
  if (first.y - second.y < 0) {
    return 'Up';
  }
  if (first.y - second.y > 0) {
    return 'Down';
  }
}

function getNextPosition() {
  const head = snake.tails[0];
  const direction = inputs.shift() || headDirection();
  switch (direction) {
    case 'Up': {
      const nextPosition = {
        x: head.x,
        y: head.y - config.sizeCell
      };
      if (nextPosition.y < 0) {
        throw new Error('Out of bounds');
      }
      if (snake.tails.slice(1).includes(nextPosition)) {
        throw new Error('Snake bit itself');
      }
      return nextPosition;
    }
    case 'Down': {
      const nextPosition = {
        x: head.x,
        y: head.y + config.sizeCell
      };
      if (nextPosition.y > 0) {
        throw new Error('Out of bounds');
      }
      if (snake.tails.slice(1).includes(nextPosition)) {
        throw new Error('Snake bit itself');
      }
      return nextPosition;
    }
    case 'Left': {
      const nextPosition = {
        x: head.x - config.sizeCell,
        y: head.y
      };
      if (nextPosition.x < 0) {
        throw new Error('Out of bounds');
      }
      if (snake.tails.slice(1).includes(nextPosition)) {
        throw new Error('Snake bit itself');
      }
      return nextPosition;
    }
    case 'Right': {
      const nextPosition = {
        x: head.x + config.sizeCell,
        y: head.y
      };
      if (nextPosition.x > 0) {
        throw new Error('Out of bounds');
      }
      if (snake.tails.slice(1).includes(nextPosition)) {
        throw new Error('Snake bit itself');
      }
      return nextPosition;
    }

  }
}

// function drawSnake() {
//   snake.x += snake.dx;
//   snake.y += snake.dy;

//   // snake.y += snake.dy * dPerSecond;
//   // snake.x += snake.dx * dPerSecond;

//   snake.tails.unshift({
//     x: snake.x,
//     y: snake.y
//   });
//   if (snake.tails.length > snake.maxTails) {
//     snake.tails.pop();
//   }

//   snake.tails.forEach(function (el, index) {
//     context.fillStyle = '#f0f0f0';
//     context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);

//     if (el.x == apple.x && el.y == apple.y) {
//       snake.maxTails++;
//       incScore();
//       randomPositionApple();

//     }

//     for (let i = index + 1; i < snake.tails.length; i++) {
//       if (snake.tails[i].x == snake.x && snake.tails[i].y == snake.y) {
//         gameOver();
//       }
//     }
//   });

//   collisionBorder();

// }