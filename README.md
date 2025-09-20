# CHESS.IO

CHESS.IO is a web-based chess application. This project includes both frontend and backend components, providing an interactive chess experience in the browser.

## Features
- Play chess in your browser
- Interactive UI with modern design
- Backend logic for game management
- Responsive layout for desktop and mobile

## Project Structure

```
app.js                # Main server file
package.json          # Project metadata and dependencies
public/
  css/style.css       # Stylesheets
  js/script.js        # Frontend JavaScript
steps/
  backendSetup.yaml   # Backend setup instructions
  frontendSetup.yaml  # Frontend setup instructions
views/
  index.ejs           # Main HTML template
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm (Node package manager)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd CHESS.IO
   ```
2. Install dependencies:
   ```
   npm install
   ```

### Running the Application
Start the server:
```
npm start
```
The app will be available at `http://localhost:3000` by default.

## Customization
- Modify `public/css/style.css` for custom styles.
- Update `public/js/script.js` for frontend logic.
- Edit `views/index.ejs` for the main page layout.

## Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

