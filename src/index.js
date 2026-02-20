/**
 * @file index.js
 * @description Application entry point - renders the root React component
 * @author Oyewole Emmanuel
 * @created 2024-01-30
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/index.css';

/**
 * Root element where the React app is mounted
 */
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * Render the app with React.StrictMode for development warnings
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Performance monitoring (optional)
 * Uncomment to measure and log performance metrics
 */
// const reportWebVitals = (onPerfEntry) => {
//   if (onPerfEntry && onPerfEntry instanceof Function) {
//     import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
//       getCLS(onPerfEntry);
//       getFID(onPerfEntry);
//       getFCP(onPerfEntry);
//       getLCP(onPerfEntry);
//       getTTFB(onPerfEntry);
//     });
//   }
// };

// reportWebVitals(console.log);