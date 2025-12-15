# CHESS.IO

CHESS.IO is a web-based chess application with a Node/Express backend and a browser-based UI, designed for real-time play against friends or AI.

## Live Demo
- Demo: https://chess-io-46rv.onrender.com

## Features
- Play chess directly in the browser with move validation.
- Interactive UI with responsive layout for desktop and mobile.
- Game state managed on the backend for reliability.
- Supports playing vs. another person (pass-and-play) or AI (if enabled).
- Lightweight setup: clone, install, and run.

## Tech Stack
- Node.js, Express
- EJS templating
- Vanilla JS, CSS

## Project Structure
```
app.js                # Main server file / entrypoint
package.json          # Project metadata and scripts
public/
  css/style.css       # Stylesheets
  js/script.js        # Frontend logic
steps/
  backendSetup.yaml   # Backend setup checklist
  frontendSetup.yaml  # Frontend setup checklist
views/
  index.ejs           # Main HTML template
```

## Requirements
- Node.js v14+ (v18+ recommended)
- npm

## Setup
1) Clone
```
git clone <repository-url>
cd CHESS.IO
```
2) Install deps
```
npm install
```

## Environment
- Set `PORT` to override the default `3000`.

## Run
```
npm start
```
App runs at `http://localhost:3000` by default.

## Scripts
- `npm start` — run server
- `npm run dev` — (add if using nodemon) hot reload server

## Customization
- Styles: `public/css/style.css`
- Frontend logic: `public/js/script.js`
- Layout/views: `views/index.ejs`

## Testing
- (Add tests) Suggested: Jest for JS unit tests; Playwright/Puppeteer for UI flows.

## Contributing
Contributions welcome—please open issues or pull requests for improvements or fixes.

