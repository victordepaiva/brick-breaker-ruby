# Brick Breaker Ruby

A classic Brick Breaker/Breakout-style [unfolding game](https://www.youtube.com/watch?v=ptk93AyICH0) built as a web application using Ruby and HTML5 Canvas, featuring an advanced upgrade system and progression mechanics.

## Features

- **Classic Gameplay**: Control paddle with arrow keys to bounce ball and destroy bricks
- **Physics Engine**: Realistic ball movement with collision detection and wall bouncing
- **Progressive Difficulty**: Ball speed increases by 0.1 every 10 bricks destroyed
- **Scoring System**: Points awarded for each brick destroyed (300 total bricks)
- **Brick Blinking Effect**: Bricks flash red for 2 frames when hit before disappearing
- **Game States**: Start screen, countdown, gameplay, and game over with retry
- **Win/Lose Conditions**: Win by destroying all 300 bricks, lose when last ball hits
- **Unlockables (Spoiler)** - <details><summary>click to expand</summary>
  
  - **Bazaar System**: Advanced upgrade shop with progression-based unlocks
  - **Progression Mechanics**: Blocks Broken currency system with persistent upgrades
  - **Record System**: Persistent high score storage using localStorage
  - **Bricko**: Interactive Bricko (rewarding)
  - **Multi-Ball System**: Purchase additional balls
    
</details>
- **Custom Cursors**: Unique cursor designs for default and clickable elements
- **Modern UI**: Dark theme with Work Sans typography and smooth animations
- **Responsive Design**: Large 960x640 canvas with optimized game elements
- **Debug Panel**: Comprehensive debug interface with statistics and testing tools

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
4. Use arrow keys or A/D to control paddle
5. Press 'E' to access the Bazaar (after unlocking)
6. Press ' (apostrophe) to toggle debug panel

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
- **Hint System**: "press E to peruse" appears at bottom-right when unlocked (permanently visible after 50 BB)

<details>
  <summary>**## Upgrade Progression (Spoiler)** - click to expand</summary>
  
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

#### **Bricko (160 BB)**
- **Appears at**: 150 Blocks Broken
- **Cost**: 160 Blocks Broken
- **Effect**: Unlocks Bricko frame below game with clickable brick character
- **Type**: One-time purchase

#### **Extra Ball (1000 BB)**
- **Appears at**: 1000 Blocks Broken
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

## Bricko Feature

A unique interactive element that adds personality to the game:

### **Bricko Frame**
- **Position**: Below the game frame, aligned to the right border
- **Size**: Square frame with width matching the Start Game button
- **Design**: Black background with white border and rounded corners

### **Bricko Brick**
- **Appearance**: Single brick element 50% larger than regular bricks
- **Interaction**: Clickable with custom cursor on hover
- **Animation**: "Dotween" effect - scales to 1.3x max size on click
- **Visual Feedback**: Blinks red for one frame when clicked

### **Bricko Rewards**
- **Bricko Tickles**: Counter increases with each click (saved in localStorage)
- **Blocks Broken**: Each click adds +1 to total Blocks Broken count
- **Debug Panel**: "Bricko Tickles" counter displayed in debug panel

### **Bricko Controls**
- **Reset Tickles**: Debug button to reset Bricko tickle counter
- **Persistence**: Tickles count saved across game sessions
- **Upgrade Integration**: Bricko frame only visible after purchasing the upgrade

</details>**Unlockables (Spoiler)**:
### **Upgrade Progression**


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
- **Bricko Tickles**: Shows total number of Bricko clicks

#### **Debug Controls**
- **Clear Record**: Resets the high score to 0 and removes from localStorage
- **Force Win**: Instantly destroys all bricks and triggers victory condition
- **Reset Win Count**: Resets the win counter to 0 and removes from localStorage
- **Reset BB Count**: Resets the Blocks Broken counter to 0
- **Reset Tickles**: Resets the Bricko tickles counter to 0
- **+ 1000 BB**: Instantly adds 1000 Blocks Broken for testing
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
- Multi-ball management with individual ball tracking

### **Storage System**
- **localStorage Keys**:
  - `brickBreakerRecord`: Highest score achieved
  - `brickBreakerTimesPlayed`: Total games played
  - `brickBreakerWins`: Total games won
  - `brickBreakerBlocksBroken`: Total bricks destroyed
  - `brickBreakerBallCount`: Total balls owned
  - `brickBreakerHighScoreUnlocked`: High score display unlocked
  - `brickBreakerViewBalanceUnlocked`: Blocks Broken counter visible
  - `brickBreakerBrickoVisible`: Bricko frame unlocked
  - `brickBreakerBrickoTickles`: Total Bricko clicks
  - `brickBreakerPeruseHintVisible`: Peruse hint visibility state
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
- Smooth animations with CSS transitions and transforms

## Development

Built with modern web technologies:
- **HTML5 Canvas** for game rendering
- **Vanilla JavaScript** for game logic and upgrade system
- **Ruby/Sinatra** for web server
- **CSS3** for styling, custom cursors, and button states
- **localStorage** for persistent game state and progression

## Recent Updates

### **Game Fixes**
- **DOM Loading**: Fixed game initialization to wait for DOM content to load
- **Bazaar Alignment**: Resolved layout shifting and alignment issues with Bazaar panel
- **Peruse Hint Logic**: Implemented proper localStorage-based visibility system
- **Blocks Broken Display**: Fixed counter positioning and visibility in Bazaar

### **New Features**
- **Bricko Character**: Added interactive brick character with clickable animations
- **Multi-Ball System**: Enhanced ball management with purchaseable extra balls
- **Improved Controls**: Added A/D key support for paddle movement
- **Enhanced Debug Panel**: Added Bricko tickles counter and reset functionality

### **UI Improvements**
- **Better Positioning**: Fixed all panel alignments and prevented layout shifts
- **Smooth Animations**: Added "dotween" scaling effects for Bricko interactions
- **Visual Feedback**: Enhanced button states and hover effects
- **Persistent State**: Improved localStorage management for all game elements
