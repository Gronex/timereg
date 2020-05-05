import './components/App/App';
import { App } from './components/App/App';

if ('serviceWorker' in navigator) {
  let newWorker: ServiceWorker | undefined;
  navigator.serviceWorker.register('/sw.js').then((registration) => {

    setInterval(() => {
      registration.update();
    }, 1000 * 60 * 60 * 3);

    registration.addEventListener('updatefound', () => {
      newWorker = registration.installing ?? undefined;

      registration.installing?.addEventListener('statechange', (_) => {

        switch (newWorker?.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              try{
                let app = document.querySelector('timereg-app') as App
                app?.notifyUpdate(newWorker);
              }
              catch(err){
                console.error(err);
              }
            }
            break;
        }
      });
    });

  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}
