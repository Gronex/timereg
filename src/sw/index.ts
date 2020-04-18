// Give TypeScript the correct global.
declare var self: ServiceWorkerGlobalScope;

const VERSION = "1";
const CACHE_KEY = 'timereg-v' + VERSION;

self.addEventListener('install', (event) => {
  console.log(`Yay installed! ${CACHE_KEY}`, event);
});

self.addEventListener('activate', event => {
  console.log('Activated!', event);
})
export default null;
