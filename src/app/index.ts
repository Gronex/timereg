import './components/App/App';

if ('serviceWorker' in navigator) {
  let newWorker : ServiceWorker | null;
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    registration.addEventListener('updatefound', () => {
      newWorker = registration.installing;

      registration.installing?.addEventListener('statechange', (event) => {

        switch (newWorker?.state) {
          case 'installed':
            if (navigator.serviceWorker.controller) {
              // TODO: Query user for this action
              setTimeout(() => {
                console.log("GOGOGO!");
                newWorker?.postMessage({ action: 'skipWaiting' });
              }, 1);
              console.log('installed');
            }
            break;
        }
      });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  });
}
