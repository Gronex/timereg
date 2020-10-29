import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import configureStore from './redux/store';
import { Provider } from 'react-redux';

let newVersion: string | undefined = undefined;
function queryUpdate(version? : string) {
  newVersion = version;
  console.log('new version!!');
}

serviceWorker.register(queryUpdate).then(update => {
  configureStore().then(store => {
    ReactDOM.render(
      <Provider store={store}>
      <React.StrictMode>
        <App newVersion={newVersion} onUpdateAccept={update ?? (() => console.warn('No update to run'))} />
      </React.StrictMode>
    </Provider>,
    document.getElementById('root')
    );
  });
})
  
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();


if('permissions' in navigator && 'storage' in navigator){
  
  navigator.permissions.query({
    name: "persistent-storage"
  }).then(permittet => {
    if (permittet.state === 'granted') {
      navigator.storage.persist()
        .then(persisted => {
          if(persisted) {
            console.log('Persisted!!');
          }
        });
    }
  });
}
