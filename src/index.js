import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store'

import './index.css';
import Modal from 'react-modal';
import App from './App';


// Set the App element for accessibility
Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>            
        <App />              
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

