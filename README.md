# Brick Breaker Ruby

A classic Brick Breaker/Breakout-style [unfolding game](https://www.youtube.com/watch?v=ptk93AyICH0) built as a web application using Ruby and HTML5 Canvas, featuring an advanced upgrade system and progression mechanics.

## Features

- **Classic Gameplay**: Control paddle with arrow keys to bounce ball and destroy bricks
- **Physics Engine**: Realistic ball movement with collision detection and wall bouncing
- **Progressive Difficulty**: Ball speed increases by 0.1 every 10 bricks destroyed
- **Scoring System**: Points awarded for each brick destroyed (300 total bricks)
- **Record System**: Persistent high score storage using localStorage
- **Brick Blinking Effect**: Bricks flash red for 2 frames when hit before disappearing
- **Game States**: Start screen, countdown, gameplay, and game over with retry
- **Win/Lose Conditions**: Win by destroying all 300 bricks, lose if ball passes paddle
- **Custom Cursors**: Unique cursor designs for default and clickable elements
- **Modern UI**: Dark theme with Work Sans typography and smooth animations
- **Responsive Design**: Large 960x640 canvas with optimized game elements
- **Debug Panel**: Comprehensive debug interface with statistics and testing tools
- **Bazaar System**: Advanced upgrade shop with progression-based unlocks
- **Progression Mechanics**: Blocks Broken currency system with persistent upgrades

## Architecture

- **Backend**: Ruby with Sinatra web framework
- **Frontend**: HTML5 Canvas with vanilla JavaScript
- **Server**: Puma web server with Rack configuration
- **Game Engine**: Pure JavaScript with `requestAnimationFrame` for smooth rendering
- **Assets**: Custom cursor system with dedicated assets directory
- **Storage**: Comprehensive localStorage system for persistent game state

## Project Structure

```
brick-breaker-ruby/
├── app.rb                    # Sinatra server with assets routing
├── config.ru                 # Rack configuration for deployment
├── Gemfile                   # Ruby dependencies (Sinatra, Puma)
├── assets/
│   └── images/
│       ├── cursor-default.png    # Default cursor for entire page
│       └── cursor-pointer.png    # Pointer cursor for clickable elements
└── public/
    ├── index.html           # Game interface with Work Sans font
    ├── game.js              # Complete game logic and physics
    └── style.css            # Game styling with custom cursors
```

## Quick Start

1. Install dependencies: `bundle install`
2. Start server: `bundle exec rackup`
3. Open browser to `http://localhost:9292`
4. Use arrow keys to control paddle
5. Press 'E' to access the Bazaar (after unlocking)

## Game Mechanics

### **Game Elements**
- **Ball**: 8px radius, light gray (`#F2F2F2`), starts at 1.5 speed
- **Paddle**: 80px wide × 8px tall, orange-to-red gradient (`#f8941c` to `#f03444`)
- **Bricks**: 30px × 12px, gray (`#ACACAD`), 25×12 grid (300 total)
- **Canvas**: 960×640 game area with black background and white border

### **Progressive Speed System**
- **Starting Speed**: 1.5 (both horizontal and vertical)
- **Speed Increase**: +0.1 every 10 bricks destroyed
- **Speed Progression**:
  - Bricks 1-9: Speed = 1.5
  - Bricks 10-19: Speed = 1.6
  - Bricks 20-29: Speed = 1.7
  - And so on...

### **Controls**
- **Left Arrow / A**: Move paddle left
- **Right Arrow / D**: Move paddle right
- **Spacebar**: Start game (if not started) or retry (if game over)
- **E Key**: Toggle Bazaar (after unlocking)
- **' Key**: Toggle debug panel visibility
- **Mouse**: Custom cursors for all interactive elements

### **Visual Design**
- **Background**: Dark gray (`#101014`)
- **Typography**: Work Sans font family
- **Cursors**: Custom PNG cursors for enhanced UX
- **Color Scheme**: Dark theme with orange/red accents
- **Brick Effects**: Red flash (`#f03444`) when bricks are hit
- **Button States**: Gradient backgrounds for purchasable upgrades

## Bazaar System

The game features an advanced upgrade shop system with progression-based unlocks:

### **Accessing the Bazaar**
- **Unlock Requirement**: Reach 50 Blocks Broken total
- **Access Method**: Press 'E' key to toggle Bazaar visibility
- **Hint System**: "press E to peruse" appears at bottom-right when unlocked

### **Upgrade Progression**

#### **View Balance (75 BB)**
- **Appears at**: 50 Blocks Broken
- **Cost**: 75 Blocks Broken
- **Effect**: Permanently reveals Blocks Broken counter in Bazaar
- **Type**: One-time purchase

#### **High Score Display (120 BB)**
- **Appears at**: 80 Blocks Broken
- **Cost**: 120 Blocks Broken
- **Effect**: Unlocks Record display in top-right corner of game
- **Type**: One-time purchase

#### **Extra Ball (1000 BB)**
- **Appears at**: 500 Blocks Broken
- **Cost**: 1000 Blocks Broken
- **Effect**: Adds +1 ball to your total ball count
- **Type**: Can be purchased multiple times

### **Button Visual States**
- **Hidden**: Button not visible (below threshold)
- **Visible (Subtle)**: Button appears with subtle background when you can see the option
- **Purchasable (Gradient)**: Button shows paddle gradient when you have enough BB to buy

### **Bazaar Features**
- **Blocks Broken Counter**: Shows total bricks destroyed across all games
- **Balls Counter**: Displays total purchased balls (only visible after first purchase)
- **Separators**: Visual dividers between sections
- **Persistent State**: All upgrades saved in localStorage

## Debug Panel

The game includes a comprehensive debug interface for testing and development:

### **Accessing Debug Panel**
- Press the **' key** (apostrophe) to toggle the debug panel
- Debug panel appears to the left of the game frame
- No layout shifting - game frame remains centered

### **Debug Panel Features**

#### **Statistics Display**
- **Wins**: Shows total number of games won
- **Times Played**: Shows total number of games played (includes retries)
- **Active Balls**: Shows current number of balls in play
- **Bazaar Tip**: Shows whether bazaar hint is unlocked

#### **Debug Controls**
- **Clear Record**: Resets the high score to 0 and removes from localStorage
- **Force Win**: Instantly destroys all bricks and triggers victory condition
- **Reset Win Count**: Resets the win counter to 0 and removes from localStorage
- **Reset BB Count**: Resets the Blocks Broken counter to 0
- **1000 BB**: Instantly adds 1000 Blocks Broken for testing
- **Clear Upgrades**: Resets all upgrades to default state

### **Debug Panel Layout**
- **Position**: Left-aligned with the game frame (200px wide)
- **Design**: Black background with white border, matching game frame styling
- **Header**: "Debug Panel" title at the top
- **Content**: Statistics and buttons arranged vertically with separators
- **Styling**: Centered buttons with compact sizing and hover effects

## Technical Details

### **Game Loop**
- Uses `requestAnimationFrame` for smooth 60fps rendering
- Collision detection between ball, paddle, walls, and bricks
- Dynamic speed adjustment based on score progression
- Brick blinking system with 2-frame red flash effect

### **Storage System**
- **localStorage Keys**:
  - `brickBreakerRecord`: Highest score achieved
  - `brickBreakerTimesPlayed`: Total games played
  - `brickBreakerWins`: Total games won
  - `brickBreakerBlocksBroken`: Total bricks destroyed
  - `brickBreakerBallCount`: Total balls owned
  - `brickBreakerHighScoreUnlocked`: High score display unlocked
  - `brickBreakerViewBalanceUnlocked`: Blocks Broken counter visible
  - `brickBreakerBazaarUnlocked`: Bazaar access unlocked

### **Asset System**
- Custom cursor images served from `/assets/images/` directory
- Sinatra configured to serve static assets from multiple directories
- Fallback cursors ensure functionality if images fail to load

### **Performance**
- Optimized canvas rendering with efficient collision detection
- Minimal DOM manipulation for smooth gameplay
- Responsive design that scales appropriately
- Efficient brick state management with status tracking
- Real-time button state updates based on BB count

## Development

Built with modern web technologies:
- **HTML5 Canvas** for game rendering
- **Vanilla JavaScript** for game logic and upgrade system
- **Ruby/Sinatra** for web server
- **CSS3** for styling, custom cursors, and button states
- **localStorage** for persistent game state and progression
