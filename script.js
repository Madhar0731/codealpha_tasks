const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");
const scoreBoard = document.getElementById("scoreBoard");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");

const box = 20;
let snake, food, direction, score, game, foodShape, gameSpeed;
const foodShapes = ["circle", "square", "triangle"];

function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = undefined;
  score = 0;
  generateFood();
  updateScore();
  if (game) clearInterval(game);
  game = setInterval(draw, gameSpeed);
}

document.addEventListener("keydown", changeDirection);
restartBtn.addEventListener("click", initGame);

difficultyButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    gameSpeed = parseInt(btn.dataset.speed);
    initGame();
  });
});

function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
  foodShape = foodShapes[Math.floor(Math.random() * foodShapes.length)];
}

function changeDirection(event) {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Snake
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      ctx.fillStyle = "yellow"; // head
    } else if (i === snake.length - 1) {
      ctx.fillStyle = "orange"; // tail
    } else {
      ctx.fillStyle = "green"; // body
    }
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw Food
  ctx.fillStyle = "red";
  if (foodShape === "circle") {
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (foodShape === "square") {
    ctx.fillRect(food.x, food.y, box, box);
  } else if (foodShape === "triangle") {
    ctx.beginPath();
    ctx.moveTo(food.x + box / 2, food.y);
    ctx.lineTo(food.x, food.y + box);
    ctx.lineTo(food.x + box, food.y + box);
    ctx.closePath();
    ctx.fill();
  }

  // Move
  let head = { x: snake[0].x, y: snake[0].y };
  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "DOWN") head.y += box;

  if (head.x === food.x && head.y === food.y) {
    score++;
    generateFood();
    updateScore();
    clearInterval(game);
    game = setInterval(draw, Math.max(gameSpeed - snake.length * 2, 30));
  } else {
    snake.pop();
  }

  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(seg => seg.x === head.x && seg.y === head.y)
  ) {
    clearInterval(game);
    alert("Game Over! Your score: " + score);
    return;
  }

  snake.unshift(head);
}

function updateScore() {
  scoreBoard.textContent = "Score: " + score;
}

// Default difficulty: Medium
gameSpeed = 100;
initGame();