const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake = [{x: 9 * box, y: 10 * box}];
let direction = null;
let food = spawnFood();
let bonus = null;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameOver = false;
let lastRenderTime = 0;
let snakeSpeed = 5;

document.getElementById("highScore").textContent = highScore;

// 🎮 Keyboard Controls
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "Enter" && gameOver) restartGame();
});

// 🎮 Mobile Controls
function changeDirection(dir) {
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

// 🍖 Spawn Food
function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

// ⭐ Spawn Bonus occasionally
function spawnBonus() {
  return Math.random() < 0.1 ? spawnFood() : null;
}

// 🎮 Game Loop
function main(currentTime) {
  if (gameOver) return;
  window.requestAnimationFrame(main);
  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
  if (secondsSinceLastRender < 1 / snakeSpeed) return;
  lastRenderTime = currentTime;

  update();
  draw();
}
window.requestAnimationFrame(main);

function update() {
  let head = {...snake[0]};
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;

  // Collision with walls or self
  if (
    head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  // Eating food
  if (head.x === food.x && head.y === food.y) {
    score++;
    snakeSpeed += 0.2;
    food = spawnFood();
    bonus = spawnBonus();
  } 
  else if (bonus && head.x === bonus.x && head.y === bonus.y) {
    score += 5;
    bonus = null;
  }
  else {
    snake.pop();
  }

  document.getElementById("score").textContent = score;
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = "lime";
  snake.forEach((s, i) => {
    ctx.fillRect(s.x, s.y, box, box);
    ctx.strokeStyle = "#111";
    ctx.strokeRect(s.x, s.y, box, box);
  });

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Draw bonus
  if (bonus) {
    ctx.fillStyle = "blue";
    ctx.fillRect(bonus.x, bonus.y, box, box);
  }
}

function endGame() {
  gameOver = true;
  document.getElementById("gameOver").style.display = "block";
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", highScore);
  }
  document.getElementById("highScore").textContent = highScore;
}

function restartGame() {
  snake = [{x: 9 * box, y: 10 * box}];
  direction = null;
  score = 0;
  snakeSpeed = 5;
  food = spawnFood();
  bonus = null;
  gameOver = false;
  document.getElementById("score").textContent = score;
  document.getElementById("gameOver").style.display = "none";
  window.requestAnimationFrame(main);
}

// 🎮 Levels
function setLevel(level) {
  if (level === "easy") snakeSpeed = 5;
  if (level === "medium") snakeSpeed = 8;
  if (level === "hard") snakeSpeed = 12;
}
