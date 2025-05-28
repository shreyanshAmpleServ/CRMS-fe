// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';


import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../src/style/css/feather.css";
import "../src/index.scss";
import "../src/style/icon/weather/weathericons.css";
import "../src/style/icon/typicons/typicons.css";
import "../src/style/icon/fontawesome/css/fontawesome.min.css";
import "../src/style/icon/fontawesome/css/all.min.css";
import "../src/style/icon/ionic/ionicons.css";
import "../src/style/icon/tabler-icons/webfont/tabler-icons.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
