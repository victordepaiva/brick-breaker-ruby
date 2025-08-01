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
const ballRadius = 8;         // Size of the ball in pixels (further scaled down)

// 🎾 Ball Object Constructor
function createBall() {
  return {
    x: canvas.width / 2,
    y: canvas.height - 50,
    dx: 1.5,
    dy: -1.5
  };
}

// Initialize balls array (will be populated after upgrades are loaded)
let activeBalls = [];

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
// Each brick has x, y coordinates and status (1 = active, 0 = destroyed, 2 = blinking)
// For blinking bricks, we also track the frame count
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1, blinkFrames: 0 };
  }
}

// 📊 Score Tracking
let score = 0;                // Player's current score (increases when bricks are destroyed)
let record = 0;               // Highest score achieved (stored in localStorage)
let timesPlayed = 0;          // Number of times the game has been played
let wins = 0;                 // Number of times the player has won
let blocksBroken = 0;         // Total blocks broken across all games
let bazaarUnlocked = false;   // Whether the bazaar has been unlocked (record >= 50)

// 🎾 Ball Management System
let ballCount = 1;            // Number of balls the player has (starts at 1)
let ballsLost = 0;           // Number of balls lost in current game
let highScoreUnlocked = false; // Whether the high score display is unlocked
let viewBalanceUnlocked = false; // Whether the blocks broken counter is visible
let brickoVisible = false; // Whether Bricko is unlocked and visible
let brickoTickles = 0; // Number of times Bricko has been tickled
let peruseHintVisible = false; // Whether the peruse hint should be visible

// 🎮 Event Listeners - Listen for keyboard input to control the paddle
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

/**
 * Handles keyboard key press events for paddle movement
 * Sets the appropriate direction flag to true when arrow keys are pressed
 * @param {KeyboardEvent} e - The keyboard event object
 */
function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = true;
}

/**
 * Handles keyboard key release events for paddle movement
 * Sets the appropriate direction flag to false when arrow keys are released
 * This stops the paddle from continuing to move when the key is no longer pressed
 * @param {KeyboardEvent} e - The keyboard event object
 */
function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d" || e.key === "D") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a" || e.key === "A") leftPressed = false;
}

/**
 * 💥 Detects collisions between the ball and bricks
 * Loops through all bricks and checks if the ball is touching any active brick
 * When a collision occurs: reverses ball direction, destroys the brick, increases score
 * Also checks for win condition when all bricks are destroyed
 * Includes dynamic speed increase system
 */
function collisionDetection() {
  for (let ball of activeBalls) {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
            ball.x > b.x &&
            ball.x < b.x + brickWidth &&
            ball.y > b.y &&
            ball.y < b.y + brickHeight
                   ) {
                     ball.dy = -ball.dy;
            b.status = 2; // Set to blinking state
            b.blinkFrames = 0; // Start frame counter
          score++;
            incrementBlocksBroken(); // Increment total blocks broken counter
           
           // 🏆 Update record if this is the first score or a new high score
           if (score === 1 || score > record) {
             updateRecord();
           }
           
           // 🚀 Dynamic Speed Increase
           // Increase ball speed every 10 bricks destroyed
           if (score % speedIncreaseInterval === 0) {
             const speedMultiplier = Math.floor(score / speedIncreaseInterval) * speedIncrease;
             const newSpeed = baseSpeed + speedMultiplier;
             
             // Preserve direction while updating speed for all balls
             for (let activeBall of activeBalls) {
               activeBall.dx = activeBall.dx > 0 ? newSpeed : -newSpeed;
               activeBall.dy = activeBall.dy > 0 ? newSpeed : -newSpeed;
             }
           }
          
          if (score === brickRowCount * brickColumnCount) {
             incrementWins(); // Increment win counter when player wins
            showOverlay("You win!", score);
           }
          }
        }
      }
    }
  }
}

/**
 * 🔴 Draws all balls on the canvas
 * Creates light gray circles for each active ball
 * The ball radius is defined by the ballRadius constant
 */
function drawBalls() {
  for (let ball of activeBalls) {
  ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#F2F2F2";
  ctx.fill();
  ctx.closePath();
  }
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
             } else if (bricks[c][r].status === 2) {
         // Draw blinking brick in red
         const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
         const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
         ctx.beginPath();
         ctx.rect(brickX, brickY, brickWidth, brickHeight);
         ctx.fillStyle = "#f03444";
         ctx.fill();
         ctx.closePath();
         
         // Increment frame counter
         bricks[c][r].blinkFrames++;
         
         // Set to destroyed after two frames
         if (bricks[c][r].blinkFrames >= 2) {
           bricks[c][r].status = 0;
         }
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
  ctx.fillText("Score: " + score + " / 300", 12, 25);
}

/**
 * 🏆 Draws the record score in the top-right corner
 * Only displays if the player has unlocked the high score feature and achieved a score > 0
 * Shows "Record: X" in white text
 */
function drawRecord() {
  if (highScoreUnlocked && record > 0) {
    ctx.font = "bold 16px 'Work Sans'";
    ctx.fillStyle = "#fff";
    const recordText = "Record: " + record;
    const textWidth = ctx.measureText(recordText).width;
    ctx.fillText(recordText, canvas.width - textWidth - 12, 25);
  }
}



/**
 * 🏆 Updates the debug win counter in the HTML element
 * Shows "Wins: X" in the debug element
 */
function updateWinCounter() {
  const debugWinsElement = document.getElementById("debugWins");
  if (debugWinsElement) {
    debugWinsElement.textContent = "Wins: " + wins;
  }
}

/**
 * 📊 Updates the debug play counter in the HTML element
 * Shows "Times Played: X" in the debug element
 */
function updatePlayCounter() {
  const debugTimesPlayedElement = document.getElementById("debugTimesPlayed");
  if (debugTimesPlayedElement) {
    debugTimesPlayedElement.textContent = "Times Played: " + timesPlayed;
  }
}

/**
 * 🎾 Updates the debug active balls counter in the HTML element
 * Shows "Active Balls: X" in the debug element
 */
function updateActiveBallsCounter() {
  const debugActiveBallsElement = document.getElementById("debugActiveBalls");
  if (debugActiveBallsElement) {
    debugActiveBallsElement.textContent = "Active Balls: " + activeBalls.length;
  }
}

/**
 * 🏪 Updates the debug bazaar tip indicator in the HTML element
 * Shows "Bazaar Tip: True/False" in the debug element
 */
function updateBazaarTipIndicator() {
  const debugBazaarTipElement = document.getElementById("debugBazaarTip");
  if (debugBazaarTipElement) {
    debugBazaarTipElement.textContent = "Bazaar Tip: " + bazaarUnlocked;
  }
}

/**
 * 🎾 Updates the bazaar balls counter in the HTML element
 * Shows "Balls: X" in the bazaar element
 * Only visible after the player has purchased their first extra ball
 */
function updateBazaarBallsCounter() {
  const bazaarBallsElement = document.getElementById("bazaarBalls");
  if (bazaarBallsElement) {
    if (ballCount > 1) {
      bazaarBallsElement.style.display = 'block';
      bazaarBallsElement.textContent = "Balls: " + ballCount;
    } else {
      bazaarBallsElement.style.display = 'none';
    }
  }
  updateBazaarSeparator();
}

/**
 * 📏 Updates the bazaar separator visibility
 * Shows separator only when both Extra Ball button and Balls counter are visible
 */
function updateBazaarSeparator() {
  const separatorElement = document.getElementById("bazaarSeparator");
  const extraBallBtn = document.getElementById("extraBallBtn");
  const bazaarBallsElement = document.getElementById("bazaarBalls");
  
  if (separatorElement && extraBallBtn && bazaarBallsElement) {
    const buttonVisible = extraBallBtn.style.display !== 'none';
    const ballsVisible = bazaarBallsElement.style.display !== 'none';
    
    if (buttonVisible && ballsVisible) {
      separatorElement.style.display = 'block';
    } else {
      separatorElement.style.display = 'none';
    }
  }
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
  drawBalls();
  drawPaddle();
  drawScore();
  drawRecord();
  collisionDetection();

  // Ball movement and collision detection
  for (let i = activeBalls.length - 1; i >= 0; i--) {
    const ball = activeBalls[i];

  // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

  // Bounce off walls
    if (ball.x + ball.dx > canvas.width - ballRadius || ball.x + ball.dx < ballRadius) ball.dx = -ball.dx;
    if (ball.y + ball.dy < ballRadius) ball.dy = -ball.dy;
    else if (ball.y + ball.dy > canvas.height - ballRadius) {
      if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
        ball.dy = -ball.dy;
    } else {
        // Ball lost - remove it from active balls
        activeBalls.splice(i, 1);
        ballsLost++;
        updateActiveBallsCounter();
        
        // Check if all balls are lost
        if (activeBalls.length === 0) {
        showOverlay("You lost!", score);
        }
      }
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
  drawBalls();
  drawPaddle();
  drawScore();
  drawRecord();
}

// 🏆 Record Management
function loadRecord() {
  const savedRecord = localStorage.getItem('brickBreakerRecord');
  record = savedRecord ? parseInt(savedRecord) : 0;
}

function updateRecord() {
  if (score > record) {
    record = score;
    localStorage.setItem('brickBreakerRecord', record.toString());
    checkBazaarUnlock();
  }
}

// 📊 Play Counter Management
function loadTimesPlayed() {
  const savedTimesPlayed = localStorage.getItem('brickBreakerTimesPlayed');
  timesPlayed = savedTimesPlayed ? parseInt(savedTimesPlayed) : 0;
}

function incrementTimesPlayed() {
  timesPlayed++;
  localStorage.setItem('brickBreakerTimesPlayed', timesPlayed.toString());
  updatePlayCounter();
}

// 🏆 Win Counter Management
function loadWins() {
  const savedWins = localStorage.getItem('brickBreakerWins');
  wins = savedWins ? parseInt(savedWins) : 0;
}

function incrementWins() {
  wins++;
  localStorage.setItem('brickBreakerWins', wins.toString());
  updateWinCounter();
}

// 🧱 Blocks Broken Counter Management
function loadBlocksBroken() {
  const savedBlocksBroken = localStorage.getItem('brickBreakerBlocksBroken');
  blocksBroken = savedBlocksBroken ? parseInt(savedBlocksBroken) : 0;
}

// 🧱 Bricko Tickles Counter Management
function loadBrickoTickles() {
  const savedBrickoTickles = localStorage.getItem('brickBreakerBrickoTickles');
  brickoTickles = savedBrickoTickles ? parseInt(savedBrickoTickles) : 0;
}

function incrementBrickoTickles() {
  brickoTickles++;
  localStorage.setItem('brickBreakerBrickoTickles', brickoTickles.toString());
  updateBrickoTicklesCounter();
}

function updateBrickoTicklesCounter() {
  const debugBrickoTicklesElement = document.getElementById('debugBrickoTickles');
  if (debugBrickoTicklesElement) {
    debugBrickoTicklesElement.textContent = "Bricko Tickles: " + brickoTickles;
  }
}

function handleBrickoClick() {
  // Increment the tickles counter
  incrementBrickoTickles();
  
  // Increment the blocks broken counter
  incrementBlocksBroken();
  
  // Make the brick blink red
  const brickoBrick = document.getElementById('brickoBrick');
  if (brickoBrick) {
    brickoBrick.classList.add('blinking');
    
    // Remove the blinking class after one frame (16ms)
    setTimeout(() => {
      brickoBrick.classList.remove('blinking');
    }, 16);
    
    // Dotween animation - scale up then back down
    const currentScale = brickoBrick.style.transform ? parseFloat(brickoBrick.style.transform.match(/scale\(([^)]+)\)/)?.[1] || 1) : 1;
    const maxScale = 1.3; // Maximum scale threshold
    const targetScale = Math.min(currentScale * 1.1, maxScale); // 10% larger, but capped at 1.3x
    
    // Scale up
    brickoBrick.style.transform = `scale(${targetScale})`;
    
    // Scale back down after 150ms
    setTimeout(() => {
      brickoBrick.style.transform = `scale(${currentScale})`;
    }, 150);
  }
}

function incrementBlocksBroken() {
  blocksBroken++;
  localStorage.setItem('brickBreakerBlocksBroken', blocksBroken.toString());
  updateBlocksBrokenCounter();
  updateViewBalanceButton();
  updateHighScoreButton();
  updateBrickoButton();
  updateExtraBallButton();
  checkBazaarUnlock();
}

function updateBlocksBrokenCounter() {
  const bazaarBlocksBrokenElement = document.getElementById('bazaarBlocksBroken');
  if (bazaarBlocksBrokenElement) {
    bazaarBlocksBrokenElement.innerHTML = "Blocks Broken:<br>" + blocksBroken;
  }
}

// 🎾 Upgrade Management System
function loadUpgrades() {
  const savedBallCount = localStorage.getItem('brickBreakerBallCount');
  ballCount = savedBallCount ? parseInt(savedBallCount) : 1;
  
  const savedHighScoreUnlocked = localStorage.getItem('brickBreakerHighScoreUnlocked');
  highScoreUnlocked = savedHighScoreUnlocked === 'true';
  
  const savedViewBalanceUnlocked = localStorage.getItem('brickBreakerViewBalanceUnlocked');
  viewBalanceUnlocked = savedViewBalanceUnlocked === 'true';
  
  const savedBrickoVisible = localStorage.getItem('brickBreakerBrickoVisible');
  brickoVisible = savedBrickoVisible === 'true';
  
  const savedPeruseHintVisible = localStorage.getItem('brickBreakerPeruseHintVisible');
  peruseHintVisible = savedPeruseHintVisible === 'true';
}

function saveUpgrades() {
  localStorage.setItem('brickBreakerBallCount', ballCount.toString());
  localStorage.setItem('brickBreakerHighScoreUnlocked', highScoreUnlocked.toString());
  localStorage.setItem('brickBreakerViewBalanceUnlocked', viewBalanceUnlocked.toString());
  localStorage.setItem('brickBreakerBrickoVisible', brickoVisible.toString());
  localStorage.setItem('brickBreakerPeruseHintVisible', peruseHintVisible.toString());
}

function buyViewBalance() {
  if (blocksBroken >= 75) {
    blocksBroken -= 75;
    viewBalanceUnlocked = true;
    
    localStorage.setItem('brickBreakerBlocksBroken', blocksBroken.toString());
    saveUpgrades();
    updateBlocksBrokenCounter();
    updateViewBalanceButton();
    updateBazaarBlocksBrokenVisibility();
  }
}

function buyHighScore() {
  if (blocksBroken >= 120) {
    blocksBroken -= 120;
    highScoreUnlocked = true;
    
    localStorage.setItem('brickBreakerBlocksBroken', blocksBroken.toString());
    saveUpgrades();
    updateBlocksBrokenCounter();
    updateHighScoreButton();
    
    // Redraw to show the record immediately
    if (gameStarted) {
      draw();
    } else {
      initialRender();
    }
  }
}

function buyBricko() {
  if (blocksBroken >= 160) {
    blocksBroken -= 160;
    brickoVisible = true;
    
    localStorage.setItem('brickBreakerBlocksBroken', blocksBroken.toString());
    saveUpgrades();
    updateBlocksBrokenCounter();
    updateBrickoButton();
    updateBrickoVisibility();
  }
}

function buyExtraBall() {
  if (blocksBroken >= 1000) {
    blocksBroken -= 1000;
    ballCount++;
    
    // Add a new ball to the active balls array
    activeBalls.push(createBall());
    
    localStorage.setItem('brickBreakerBlocksBroken', blocksBroken.toString());
    saveUpgrades();
    updateBlocksBrokenCounter();
    updateActiveBallsCounter();
    updateBazaarBallsCounter();
    updateExtraBallButton();
  }
}

function updateViewBalanceButton() {
  const viewBalanceBtn = document.getElementById('viewBalanceBtn');
  if (viewBalanceBtn) {
    if (blocksBroken >= 50 && !viewBalanceUnlocked) {
      viewBalanceBtn.style.display = 'block';
      // Add purchasable class if player has enough BB
      if (blocksBroken >= 75) {
        viewBalanceBtn.classList.add('purchasable');
      } else {
        viewBalanceBtn.classList.remove('purchasable');
      }
    } else {
      viewBalanceBtn.style.display = 'none';
      viewBalanceBtn.classList.remove('purchasable');
    }
  }
}

function updateBazaarBlocksBrokenVisibility() {
  const bazaarBlocksBrokenElement = document.getElementById('bazaarBlocksBroken');
  const bazaarSeparatorElement = document.getElementById('bazaarSeparator');
  
  if (bazaarBlocksBrokenElement && bazaarSeparatorElement) {
    if (viewBalanceUnlocked) {
      bazaarBlocksBrokenElement.style.display = 'block';
      bazaarSeparatorElement.style.display = 'block';
    } else {
      bazaarBlocksBrokenElement.style.display = 'none';
      bazaarSeparatorElement.style.display = 'none';
    }
  }
}

function updateHighScoreButton() {
  const highScoreBtn = document.getElementById('highScoreBtn');
  if (highScoreBtn) {
    if (blocksBroken >= 80 && !highScoreUnlocked) {
      highScoreBtn.style.display = 'block';
      // Add purchasable class if player has enough BB
      if (blocksBroken >= 120) {
        highScoreBtn.classList.add('purchasable');
      } else {
        highScoreBtn.classList.remove('purchasable');
      }
    } else {
      highScoreBtn.style.display = 'none';
      highScoreBtn.classList.remove('purchasable');
    }
  }
}

function updateBrickoButton() {
  const brickoBtn = document.getElementById('brickoBtn');
  if (brickoBtn) {
    if (blocksBroken >= 150 && !brickoVisible) {
      brickoBtn.style.display = 'block';
      // Add purchasable class if player has enough BB
      if (blocksBroken >= 160) {
        brickoBtn.classList.add('purchasable');
      } else {
        brickoBtn.classList.remove('purchasable');
      }
    } else {
      brickoBtn.style.display = 'none';
      brickoBtn.classList.remove('purchasable');
    }
  }
}

function updateBrickoVisibility() {
  const newFrame = document.getElementById('newFrame');
  if (newFrame) {
    newFrame.style.display = brickoVisible ? 'flex' : 'none';
  }
}

function updatePeruseHintVisibility() {
  const peruseHint = document.getElementById('peruseHint');
  if (peruseHint) {
    peruseHint.style.display = peruseHintVisible ? 'block' : 'none';
  }
}

function updateExtraBallButton() {
  const extraBallBtn = document.getElementById('extraBallBtn');
  if (extraBallBtn) {
    if (blocksBroken >= 500) {
      extraBallBtn.style.display = 'block';
      // Add purchasable class if player has enough BB
      if (blocksBroken >= 1000) {
        extraBallBtn.classList.add('purchasable');
      } else {
        extraBallBtn.classList.remove('purchasable');
      }
    } else {
      extraBallBtn.style.display = 'none';
      extraBallBtn.classList.remove('purchasable');
    }
  }
  updateBazaarSeparator();
}

function clearUpgrades() {
  ballCount = 1;
  highScoreUnlocked = false;
  viewBalanceUnlocked = false;
  brickoVisible = false;
  peruseHintVisible = false;
  bazaarUnlocked = false;
  localStorage.removeItem('brickBreakerBazaarUnlocked');
  saveUpgrades();
  updateBazaarBallsCounter();
  updateExtraBallButton();
  updateHighScoreButton();
  updateViewBalanceButton();
  updateBrickoButton();
  updateBrickoVisibility();
  updatePeruseHintVisibility();
  updateBazaarBlocksBrokenVisibility();
  updateBazaarTipIndicator();
  hideBazaarHint();
  
  // Redraw to hide the record immediately
  if (gameStarted) {
    draw();
  } else {
    initialRender();
  }
}

function add1000BB() {
  blocksBroken += 1000;
  localStorage.setItem('brickBreakerBlocksBroken', blocksBroken.toString());
  updateBlocksBrokenCounter();
  updateViewBalanceButton();
  updateHighScoreButton();
  updateExtraBallButton();
}

// 🏪 Bazaar Management
function loadBazaarStatus() {
  const savedBazaarStatus = localStorage.getItem('brickBreakerBazaarUnlocked');
  bazaarUnlocked = savedBazaarStatus === 'true';
}

function checkBazaarUnlock() {
  if (blocksBroken >= 50 && !bazaarUnlocked) {
    bazaarUnlocked = true;
    localStorage.setItem('brickBreakerBazaarUnlocked', 'true');
    showBazaarHint();
    updateBazaarTipIndicator();
  }
  
  // Check for peruse hint unlock
  if (blocksBroken >= 50 && !peruseHintVisible) {
    peruseHintVisible = true;
    localStorage.setItem('brickBreakerPeruseHintVisible', 'true');
    updatePeruseHintVisibility();
  }
}

function showBazaarHint() {
  const bazaarHint = document.getElementById('bazaarHint');
  if (bazaarHint) {
    bazaarHint.style.display = 'block';
  }
}

function hideBazaarHint() {
  const bazaarHint = document.getElementById('bazaarHint');
  if (bazaarHint) {
    bazaarHint.style.display = 'none';
  }
}

function toggleBazaar() {
  const bazaarElement = document.getElementById('bazaarElement');
  if (bazaarElement) {
    const currentDisplay = bazaarElement.style.display || getComputedStyle(bazaarElement).display;
    const isVisible = currentDisplay === 'flex';
    bazaarElement.style.display = isVisible ? 'none' : 'flex';
  }
}

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
  // Load record, play counter, wins, blocks broken, upgrades, and bazaar status on game start
  loadRecord();
  loadTimesPlayed();
  loadWins();
  loadBlocksBroken();
  loadBrickoTickles();
  loadUpgrades();
  loadBazaarStatus();

  // Initialize balls based on player's total ball count
  for (let i = 0; i < ballCount; i++) {
    activeBalls.push(createBall());
  }

  updateWinCounter();
  updatePlayCounter();
  updateActiveBallsCounter();
  updateBrickoTicklesCounter();
  updateBazaarBallsCounter();
  updateBlocksBrokenCounter();
  updateExtraBallButton();
  updateHighScoreButton();
  updateViewBalanceButton();
  updateBrickoButton();
  updateBrickoVisibility();
  updatePeruseHintVisibility();
  updateBazaarBlocksBrokenVisibility();
  updateBazaarTipIndicator();
  checkBazaarUnlock();

  // Initial render to show game elements (static, no animation loop)
  initialRender();
});

/**
 * ⏱️ Displays a countdown timer before the game starts
 * Shows "3, 2, 1, GO!" with a 1-second interval between each number
 * Once complete, hides the countdown and executes the provided callback
 * @param {Function} callback - Function to execute when countdown finishes (usually starts the game)
 */
function showCountdown(callback) {
  const countdownEl = document.getElementById("countdown");
  const countdownText = document.getElementById("countdownText");
  let count = 3;
  
  countdownEl.style.display = "flex";
  countdownText.textContent = count;
  countdownText.style.transform = "translateY(120px)";
  
  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownText.textContent = count;
    } else {
      countdownText.textContent = "GO!";
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
    incrementTimesPlayed(); // Increment play counter when game starts
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
    incrementTimesPlayed(); // Increment play counter on retry as well
    resetGame();
    initialRender(); // Redraw game elements immediately
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
  activeBalls = []; // Start with empty array
  // Add the correct number of balls based on player's total ball count
  for (let i = 0; i < ballCount; i++) {
    activeBalls.push(createBall());
  }
  ballsLost = 0;
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;
  
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r].status = 1;
         bricks[c][r].blinkFrames = 0;
      }
    }
  
    gameStarted = true;
         updateActiveBallsCounter();
}

// 🔧 Debug functionality
let debugVisible = false;

/**
 * Toggles the visibility of debug element (which contains the buttons)
 * Called when the ' key is pressed
 */
function toggleDebugButtons() {
  debugVisible = !debugVisible;
  const debugElement = document.getElementById("debugElement");
  debugElement.style.display = debugVisible ? "flex" : "none";
}

/**
 * Clears the record from localStorage and resets the display
 * Called when "Clear Record" button is clicked
 */
function clearRecord() {
  record = 0;
  localStorage.removeItem('brickBreakerRecord');
  // Redraw to update the display
  if (gameStarted) {
    draw();
  } else {
    initialRender();
  }
}

/**
 * Forces a win condition by destroying all bricks
 * Called when "Force Win" button is clicked
 */
function forceWin() {
  // Destroy all bricks
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 0;
    }
  }
  score = brickRowCount * brickColumnCount;
  incrementWins(); // Increment win counter when force winning
  showOverlay("You win!", score);
}

/**
 * Resets the win counter to zero
 * Called when "Reset Win Count" button is clicked
 */
function resetWinCount() {
  wins = 0;
  localStorage.removeItem('brickBreakerWins');
  updateWinCounter();
}

/**
 * Resets the blocks broken counter to zero
 * Called when "Reset BB Count" button is clicked
 */
function resetBlocksBrokenCount() {
  blocksBroken = 0;
  localStorage.removeItem('brickBreakerBlocksBroken');
  updateBlocksBrokenCounter();
}

function resetTicklesCount() {
  brickoTickles = 0;
  localStorage.removeItem('brickBreakerBrickoTickles');
  updateBrickoTicklesCounter();
}

// 🎮 Debug event listeners
document.addEventListener("keydown", (e) => {
  if (e.key === "'" || e.key === "'") {
    toggleDebugButtons();
  }
  
  // E key to toggle bazaar
  if (e.key === "e" || e.key === "E") {
    toggleBazaar();
  }
  
  // Spacebar controls for game start/retry
  if (e.key === " ") {
    e.preventDefault(); // Prevent page scroll
    
    // If game hasn't started and start button is visible, start the game
    if (!gameStarted && document.getElementById("startBtn").style.display !== "none") {
      startGame();
    }
    // If game is over (overlay is visible), retry the game
    else if (document.getElementById("overlay").style.display === "flex") {
      document.getElementById("retryBtn").click();
    }
  }
});

// Debug button event listeners
document.getElementById("clearRecordBtn").addEventListener("click", clearRecord);
document.getElementById("forceWinBtn").addEventListener("click", forceWin);
document.getElementById("resetWinCountBtn").addEventListener("click", resetWinCount);
document.getElementById("resetBBCountBtn").addEventListener("click", resetBlocksBrokenCount);
document.getElementById("resetTicklesBtn").addEventListener("click", resetTicklesCount);
document.getElementById("add1000BBBtn").addEventListener("click", add1000BB);
document.getElementById("clearUpgradesBtn").addEventListener("click", clearUpgrades);
document.getElementById("extraBallBtn").addEventListener("click", buyExtraBall);
document.getElementById("highScoreBtn").addEventListener("click", buyHighScore);
document.getElementById("viewBalanceBtn").addEventListener("click", buyViewBalance);
document.getElementById("brickoBtn").addEventListener("click", buyBricko);

// Bricko brick event listener
document.getElementById("brickoBrick").addEventListener("click", handleBrickoClick);
  