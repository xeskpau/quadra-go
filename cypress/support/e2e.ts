// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top;
if (app) {
  const log = app.console.log;
  app.console.log = (...args) => {
    if (args.length === 1 && typeof args[0] === 'string' && args[0].includes('Download the React DevTools')) {
      return;
    }
    log(...args);
  };
} 