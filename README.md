# Brick Breaker Ruby

A classic Brick Breaker/Breakout-style arcade game built as a web application using Ruby and HTML5 Canvas.

## Features

- **Classic Gameplay**: Control paddle with arrow keys to bounce ball and destroy bricks
- **Physics Engine**: Realistic ball movement with collision detection and wall bouncing
- **Progressive Difficulty**: Ball speed increases by 0.1 every 10 bricks destroyed
- **Scoring System**: Points awarded for each brick destroyed (300 total bricks)
- **Game States**: Start screen, countdown, gameplay, and game over with retry
- **Win/Lose Conditions**: Win by destroying all 300 bricks, lose if ball passes paddle
- **Custom Cursors**: Unique cursor designs for default and clickable elements
- **Modern UI**: Dark theme with Work Sans typography and smooth animations
- **Responsive Design**: Large 960x640 canvas with optimized game elements

## Architecture

- **Backend**: Ruby with Sinatra web framework
- **Frontend**: HTML5 Canvas with vanilla JavaScript
- **Server**: Puma web server with Rack configuration
- **Game Engine**: Pure JavaScript with `requestAnimationFrame` for smooth rendering
- **Assets**: Custom cursor system with dedicated assets directory

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
- **Left Arrow**: Move paddle left
- **Right Arrow**: Move paddle right
- **Mouse**: Custom cursors for all interactive elements

### **Visual Design**
- **Background**: Dark gray (`#101014`)
- **Typography**: Work Sans font family
- **Cursors**: Custom PNG cursors for enhanced UX
- **Color Scheme**: Dark theme with orange/red accents

## Technical Details

### **Game Loop**
- Uses `requestAnimationFrame` for smooth 60fps rendering
- Collision detection between ball, paddle, walls, and bricks
- Dynamic speed adjustment based on score progression

### **Asset System**
- Custom cursor images served from `/assets/images/` directory
- Sinatra configured to serve static assets from multiple directories
- Fallback cursors ensure functionality if images fail to load

### **Performance**
- Optimized canvas rendering with efficient collision detection
- Minimal DOM manipulation for smooth gameplay
- Responsive design that scales appropriately

## Development

Built with modern web technologies:
- **HTML5 Canvas** for game rendering
- **Vanilla JavaScript** for game logic
- **Ruby/Sinatra** for web server
- **CSS3** for styling and custom cursors
