import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorFallbackGlobal from './components/error-boundary/error-fallback-global.component';
import { logError } from './components/error-boundary/logError';

import { Provider } from 'react-redux';
import store from './store';

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ErrorBoundary
      FallbackComponent={ErrorFallbackGlobal}
      onError={logError}
    >
      <App />
    </ErrorBoundary>
  </Provider>
);

reportWebVitals();
