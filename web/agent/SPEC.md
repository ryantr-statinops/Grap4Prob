# SPEC - Premium Probability Visualizer (v2.0)

## Core Feature
Simulate various random events (Dice, Coin) and visualize convergence to theoretical probability using Modern Web Tech.

## Architecture
- **Engine**: `js/simulation.js` (Deterministic random logic).
- **UI Controller**: `js/ui.js` (DOM & Chart management).
- **Entry Point**: `js/main.js` (Event orchestration).
- **Styling**: `style.css` (Glassmorphism design system).

## Requirements

### Input
- Number of trials (n): Up to 1,000,000.
- Simulation type: Dice (6 faces) or Coin (2 faces).

### Visualization
- Bar chart (Empirical) + Line chart (Theoretical).
- Interactive legend and tooltips.

### AI Analysis
- Dynamic feedback based on sample size (n) and convergence error.

### UI/UX
- Dashboard layout.
- Smooth CSS animations (`rolling` state).
- Fully responsive design.

## Constraints
- ES Modules (no bundler required).
- No external JS frameworks (Vanilla JS).
- Chart.js via CDN.