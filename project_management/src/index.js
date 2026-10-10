import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// The API now checks the login session on every project route. The session is
// identified by a cookie, so every request to the API must send it. Most fetch
// calls in the app don't set credentials themselves, so we add it here once,
// globally, for API URLs only.
const apiHost = process.env.REACT_APP_HOST;
const originalFetch = window.fetch;
window.fetch = (input, init = {}) => {
  const url = typeof input === 'string' ? input : (input && input.url);
  if (url && url.startsWith(apiHost)) {
    return originalFetch(input, { ...init, credentials: 'include' });
  }
  return originalFetch(input, init);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
