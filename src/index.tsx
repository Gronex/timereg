import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
//import * as serviceWorker from './serviceWorker';
import configureStore from './redux/store';
import { Provider } from 'react-redux';

const store = configureStore();

const div = document.createElement('div');
document.body.appendChild(div);
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  div
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
