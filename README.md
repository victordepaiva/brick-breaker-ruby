# Brick Breaker Ruby

A classic Brick Breaker/Breakout-style arcade game built as a web application using Ruby and HTML5 Canvas.

## Features

- **Classic Gameplay**: Control paddle with arrow keys to bounce ball and destroy bricks
- **Physics Engine**: Realistic ball movement with collision detection
- **Scoring System**: Points awarded for each brick destroyed
- **Game States**: Start screen, countdown, gameplay, and game over with retry
- **Win/Lose Conditions**: Win by destroying all 15 bricks, lose if ball passes paddle
- **Responsive UI**: Dark theme with overlays and smooth animations

## Architecture

- **Backend**: Ruby with Sinatra web framework
- **Frontend**: HTML5 Canvas with vanilla JavaScript
- **Server**: Puma web server with Rack configuration
- **Game Engine**: Pure JavaScript with `requestAnimationFrame` for smooth rendering

## Project Structure

```
brick-breaker-ruby/
├── app.rb              # Sinatra server serving static files
├── config.ru           # Rack configuration for deployment
├── Gemfile            # Ruby dependencies (Sinatra, Puma)
└── public/
    ├── index.html     # Game interface and canvas
    ├── game.js        # Complete game logic and physics
    └── style.css      # Game styling and UI components
```

## Quick Start

1. Install dependencies: `bundle install`
2. Start server: `bundle exec rackup`
3. Open browser to `http://localhost:9292`
4. Use arrow keys to control paddle

## Game Mechanics

- **Ball**: 10px radius, bounces off walls and paddle
- **Paddle**: 75px wide, controlled with left/right arrow keys
- **Bricks**: 3x5 grid (15 total), each worth 1 point
- **Canvas**: 480x320 game area with dark theme
