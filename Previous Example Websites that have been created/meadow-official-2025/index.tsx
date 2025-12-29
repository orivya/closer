import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import LogRocket from 'logrocket';
import AppWithAuth from './App';

// Initialize Sentry error tracking with logging
Sentry.init({
  dsn: "https://3e7c3681f56f7ffccdd574336a1f1948@o4510583178461184.ingest.us.sentry.io/4510583199039488",
  sendDefaultPii: true,
  _experiments: {
    enableLogs: true
  },
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
});

// Initialize LogRocket session recording
LogRocket.init('rji02w/meadow');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppWithAuth />
  </React.StrictMode>
);