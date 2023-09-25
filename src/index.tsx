import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import "./input.css";

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      {/* Adding some info in footer */}
      <footer className="text-center text-gray-600 text-xs"> The purpose of this web app is for technical exam </footer>
    </Provider>
  </React.StrictMode>
);
