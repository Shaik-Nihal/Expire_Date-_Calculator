# Expiry Date Calculator (Fresh Check)

Fresh Check is a responsive web application that helps you calculate a product's expiry status from its manufacturing date.

You can calculate expiry in two ways:

1. Add shelf-life duration in months.
2. Enter a specific expiry date directly.

The app then shows whether the product is valid or expired, plus time left (or elapsed time) in days and months.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [How It Works](#how-it-works)
4. [Input Rules and Validation](#input-rules-and-validation)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Available Scripts](#available-scripts)
8. [Troubleshooting](#troubleshooting)
9. [Build and Deployment](#build-and-deployment)
10. [Possible Improvements](#possible-improvements)
11. [License](#license)

## Features

- Manufacturing date input with:
  - Year dropdown (current year down to 15 years back)
  - Month dropdown
  - Optional day dropdown
- Day dropdown updates dynamically by month/year (including leap years).
- Prevents future manufacturing dates and displays inline error state.
- Two expiry calculation modes:
  - Months Duration
  - Specific Date
- Result card with:
  - Expiry date (human-readable format)
  - Product status (Valid/Expired)
  - Remaining or elapsed time in days
  - Approximate month summary
- Responsive dark-themed glassmorphism UI.
- Accessible focus styles and visual state indicators.
- Improved select dropdown readability across browsers.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)
- Vite 7 (dev server and build tooling)

## How It Works

### 1) Manufacturing Date

- User selects year and month.
- Day is optional.
- If day is left blank, the app assumes day = 1 for calculations.

### 2) Expiry Mode

- **Months Duration mode:**
  - Reads shelf life from input (months).
  - Adds months to manufacturing date using JavaScript `Date.setMonth()`.
- **Specific Date mode:**
  - Uses the selected date input directly as expiry date.

### 3) Status Calculation

- The app compares expiry date with today's date (normalized to start of day).
- If difference in days is less than 0, status is **Expired**.
- Otherwise status is **Valid**.

### 4) Displayed Outputs

- Expiry date in `Month Day, Year` format.
- Valid state:
  - Remaining months = `days / 30` (1 decimal place)
  - Remaining days
- Expired state:
  - Shows elapsed days if under 30 days
  - Shows elapsed months (`days / 30`) for larger ranges

## Input Rules and Validation

- Manufacturing month and year are required.
- Manufacturing day is optional.
- Manufacturing date cannot be in the future.
- In the current month/year, selectable day is capped at today's date.
- Shelf life is expected to be a positive month value.
- In specific-date mode, expiry date is required.

## Project Structure

```text
ExpireDateCalculator/
|- index.html        # Main app markup and UI structure
|- main.js           # Core app logic and calculations
|- style.css         # Main app styling
|- package.json      # Scripts and dependencies
|- public/           # Static public assets (if added)
|- src/              # Default Vite starter files (currently not used by main app)
`- dist/             # Production build output (generated)
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+

### Installation

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Available Scripts

- `npm run dev` - Starts local development server.
- `npm run build` - Builds production assets into `dist/`.
- `npm run preview` - Serves the production build locally.

## Troubleshooting

### 1) Vite binary not found

If you see an error like:

```text
node_modules/.bin/vite: ../vite/bin/vite.js: not found
```

Run a clean reinstall:

```bash
rm -rf node_modules
npm install
```

### 2) Linux file watcher limit (ENOSPC)

If dev server crashes with an ENOSPC watcher error, run with polling:

```bash
CHOKIDAR_USEPOLLING=true CHOKIDAR_INTERVAL=500 npm run dev -- --host 0.0.0.0 --port 5173
```

Optional system-level fix:

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Build and Deployment

Create production build:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Deploy the generated `dist/` folder to any static hosting provider, such as:

- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

## Possible Improvements

- Add unit tests for date calculation edge cases.
- Validate expiry date is not before manufacturing date (optional strict mode).
- Support custom timezone selection.
- Add export/share result feature.
- Remove unused Vite starter files in `src/` for cleaner repository structure.

## License

No license file is currently included in this repository.

If you plan to distribute this project publicly, add a license (for example, MIT) before release.