import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/index.css';
import { configBackEnd } from './services/authentication/auth.backend';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { initServiceWorker, updateServiceWorker } from './utils/service/swSlice';
import { persistStorage } from './utils/service/storage';

const container = document.getElementById('root')!;
const root = createRoot(container);

configBackEnd();
persistStorage();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    store.dispatch(updateServiceWorker(registration))
    console.log('New content is available; please refresh.');
  },
  onSuccess: (registration) => {
    store.dispatch(initServiceWorker(registration))
    console.log('Service worker registration successful with scope: ', registration.scope);
  }

});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
