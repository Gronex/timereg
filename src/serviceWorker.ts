import { SettingsRepository } from "./services/SettingsRepository";

export async function register(promptCallback : ((version?: string) => void)) {
  if('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('./service-worker.ts');

      listenForWaitingServiceWorker(registration, () => promptUserToRefresh(promptCallback));
      return () => registration.waiting?.postMessage('skipWaiting')
    } catch (error) {
      console.log('Service worker registration failed, error:', error);
    }
  }
}

function listenForWaitingServiceWorker(reg : ServiceWorkerRegistration, callback : ((reg : ServiceWorkerRegistration) => void)) {
  function awaitStateChange() {
    reg.installing?.addEventListener('statechange', function() {
      if (this.state === 'installed') callback(reg);
    });
  }
  if (!reg) return;
  if (reg.waiting) return callback(reg);
  if (reg.installing) awaitStateChange();
  reg.addEventListener('updatefound', awaitStateChange);
}

// reload once when the new Service Worker starts activating
let refreshing = false;
navigator.serviceWorker.addEventListener('controllerchange',
  function() {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  }
);

async function promptUserToRefresh(promptCallback : ((version?: string) => void)) {
  const version = await (await SettingsRepository.getCurent()).getSetting('newVersion');
  promptCallback(version);
}