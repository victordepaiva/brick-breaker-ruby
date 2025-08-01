/**
 * 🎮 BRICK BREAKER GAME - Main Game Logic
 * 
 * A classic arcade-style brick breaker game where players control a paddle
 * to bounce a ball and destroy all the bricks to win!
 * 
 * Game Features:
 * - Smooth ball physics with realistic bouncing
 * - Keyboard controls (left/right arrow keys)
 * - Collision detection between ball, paddle, and bricks
 * - Score tracking and win/lose conditions
 * - Countdown timer and game state management
 * - Retry functionality for endless fun!
 * 
 * Author: Victor de Paiva
 * Built with HTML5 Canvas and vanilla JavaScript
 */

// 🎯 Game State Management
let gameLoop = null;          // Stores the animation frame ID for the game loop
let gameStarted = false;      // Flag to track if the game is currently active

// 🖼️ Canvas Setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ⚽ Ball Properties
let x = canvas.width / 2;     // Ball's current X position (starts in center)
let y = canvas.height - 50;   // Ball's current Y position (starts just above paddle)
let dx = 1.5;                 // Ball's horizontal speed (positive = moving right)
let dy = -1.5;                // Ball's vertical speed (negative = moving up)
const ballRadius = 8;         // Size of the ball in pixels (further scaled down)

// 🚀 Dynamic Speed System
const baseSpeed = 1.5;        // Starting speed for both dx and dy
const speedIncrease = 0.1;    // Speed increase per 10 bricks destroyed
const speedIncreaseInterval = 10; // Every 10 bricks destroyed

// 🏓 Paddle Properties
const paddleHeight = 8;       // How tall the paddle is (further scaled down)
const paddleWidth = 80;       // How wide the paddle is (further scaled down)
let paddleX = (canvas.width - paddleWidth) / 2;  // Paddle's X position (starts centered)

// ⌨️ Input State Tracking
let rightPressed = false;     // Is the right arrow key currently pressed?
let leftPressed = false;      // Is the left arrow key currently pressed?

// 🧱 Brick Configuration (expanded for larger canvas)
const brickRowCount = 12;     // Number of rows of bricks (more rows to fill height)
const brickColumnCount = 25;  // Number of columns of bricks (more to fill width)
const brickWidth = 30;        // Width of each brick (slightly smaller for more spacing)
const brickHeight = 12;       // Height of each brick (slightly smaller)
const brickPadding = 8;       // Space between bricks (more spacing)
const brickOffsetTop = 80;    // Distance from top of canvas to first brick row (moved lower)
// Calculate left offset to center the brick grid across the full canvas width
const totalBrickWidth = brickColumnCount * brickWidth + (brickColumnCount - 1) * brickPadding;
const brickOffsetLeft = (canvas.width - totalBrickWidth) / 2;

// 🧱 Brick Grid Initialization
// Create a 2D array to store all brick objects
// Each brick has x, y coordinates and status (1 = active, 0 = destroyed)
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// 📊 Score Tracking
let score = 0;                // Player's current score (increases when bricks are destroyed)

// 🎮 Event Listeners - Listen for keyboard input to control the paddle
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

/**
 * Handles keyboard key press events for paddle movement
 * Sets the appropriate direction flag to true when arrow keys are pressed
 * @param {KeyboardEvent} e - The keyboard event object
 */
function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

/**
 * Handles keyboard key release events for paddle movement
 * Sets the appropriate direction flag to false when arrow keys are released
 * This stops the paddle from continuing to move when the key is no longer pressed
 * @param {KeyboardEvent} e - The keyboard event object
 */
function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

/**
 * 💥 Detects collisions between the ball and bricks
 * Loops through all bricks and checks if the ball is touching any active brick
 * When a collision occurs: reverses ball direction, destroys the brick, increases score
 * Also checks for win condition when all bricks are destroyed
 * Includes dynamic speed increase system
 */
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          
          // 🚀 Dynamic Speed Increase
          // Increase ball speed every 10 bricks destroyed
          if (score % speedIncreaseInterval === 0) {
            const speedMultiplier = Math.floor(score / speedIncreaseInterval) * speedIncrease;
            const newSpeed = baseSpeed + speedMultiplier;
            
            // Preserve direction while updating speed
            dx = dx > 0 ? newSpeed : -newSpeed;
            dy = dy > 0 ? newSpeed : -newSpeed;
          }
          
          if (score === brickRowCount * brickColumnCount) {
            showOverlay("You win!", score);
          }
        }
      }
    }
  }
}

/**
 * 🔴 Draws the ball on the canvas
 * Creates a light gray circle at the current ball position (x, y)
 * The ball radius is defined by the ballRadius constant
 */
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#F2F2F2";
  ctx.fill();
  ctx.closePath();
}

/**
 * 🏓 Draws the paddle on the canvas
 * Creates an orange-to-red gradient rectangle at the bottom of the screen
 * The paddle position is controlled by the paddleX variable (left-right movement)
 */
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  
  // Create horizontal linear gradient from #f8941c to #f03444
  const gradient = ctx.createLinearGradient(paddleX, 0, paddleX + paddleWidth, 0);
  gradient.addColorStop(0, "#f8941c");    // Orange on the left
  gradient.addColorStop(1, "#f03444");    // Red on the right
  
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.closePath();
}

/**
 * 🧱 Draws all the bricks on the canvas
 * Only draws bricks that are still active (status = 1)
 * Calculates each brick's position based on row/column and spacing
 * Creates a gray rectangular grid of destructible bricks
 */
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#ACACAD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

/**
 * 📊 Draws the current score on the canvas
 * Displays "Score: X" in the top-left corner in white text
 * Updates in real-time as the player destroys bricks
 */
function drawScore() {
  ctx.font = "bold 16px 'Work Sans'";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 12, 25);
}

/**
 * 🎨 Main game loop function - handles all game rendering and logic
 * This function runs continuously during gameplay using requestAnimationFrame
 * Responsibilities:
 * - Clears the canvas and redraws all game elements
 * - Updates ball and paddle positions
 * - Handles collision detection
 * - Manages ball physics (bouncing off walls, paddle, and bricks)
 * - Controls game flow and win/lose conditions
 */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();

  // Ball movement
  x += dx;
  y += dy;

  // Bounce off walls
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
        showOverlay("You lost!", score);
      }
  }

  // Paddle movement
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
  else if (leftPressed && paddleX > 0) paddleX -= 5;

  // Only continue the game loop if the game is still active
  if (gameStarted) {
    gameLoop = requestAnimationFrame(draw);
  }
}

/**
 * 🎬 Initial render function to show game elements without starting animation
 * Displays the game board in its starting state before the player begins
 * Unlike draw(), this only renders once and doesn't start the game loop
 * Perfect for showing the player what they're about to play!
 */
function initialRender() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
}

// Initial render to show game elements (static, no animation loop)
initialRender();

/**
 * ⏱️ Displays a countdown timer before the game starts
 * Shows "3, 2, 1, GO!" with a 1-second interval between each number
 * Once complete, hides the countdown and executes the provided callback
 * @param {Function} callback - Function to execute when countdown finishes (usually starts the game)
 */
function showCountdown(callback) {
  const countdownEl = document.getElementById("countdown");
  let count = 3;
  
  countdownEl.style.display = "flex";
  countdownEl.textContent = count;
  
  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      countdownEl.textContent = "GO!";
      setTimeout(() => {
        countdownEl.style.display = "none";
        callback();
      }, 500);
      clearInterval(countdownInterval);
    }
  }, 1000);
}

/**
 * 🚀 Starts a new game session
 * Prevents multiple games from running simultaneously
 * Hides the start button, shows countdown, then begins the game loop
 * This is called when the player clicks the "START GAME" button
 */
function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    if (gameLoop) cancelAnimationFrame(gameLoop);
    document.getElementById("startBtn").style.display = "none";
    showCountdown(() => {
      draw();
    });
  }
  
  
  
  // 🖱️ Start button event listener - begins the game when clicked
  document.getElementById("startBtn").addEventListener("click", startGame);
  
  /**
   * 🎭 Shows the game over overlay with win/lose message
   * Stops the game loop, displays the final score and message
   * Used for both winning ("You win!") and losing ("You lost!") scenarios
   * @param {string} message - The message to display (win or lose)
   * @param {number} score - The player's final score
   */
  function showOverlay(message, score) {
    gameStarted = false;
    document.getElementById("message").textContent = message;
    document.getElementById("finalScore").textContent = "Final Score: " + score;
    document.getElementById("overlay").style.display = "flex";
  }
  
  // 🔄 Retry button event listener - starts a new game when clicked
  document.getElementById("retryBtn").addEventListener("click", () => {
    document.getElementById("overlay").style.display = "none";
    resetGame();
    showCountdown(() => {
      draw();
    });
  });
  
  /**
   * 🔄 Resets all game variables to their starting state
   * Cancels any running animation loops to prevent conflicts
   * Repositions ball and paddle, resets score, and restores all bricks
   * Called when the player clicks retry after a game ends
   */
  function resetGame() {
    if (gameLoop) cancelAnimationFrame(gameLoop); // 👈 also cancel here
  
    // Reset state
    x = canvas.width / 2;
    y = canvas.height - 50;
    dx = baseSpeed;        // Reset to base speed
    dy = -baseSpeed;       // Reset to base speed (negative for upward movement)
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;
  
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r].status = 1;
      }
    }
  
    gameStarted = true;
}
  