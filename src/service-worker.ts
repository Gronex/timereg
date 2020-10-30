import { setValue } from "./services/SettingsRepository";
import { version } from '../package.json';

export default null;


declare var self: ServiceWorkerGlobalScope;

const cacheName = 'timereg-resource-cache';

self.addEventListener('install', async _ => {
    console.log('setting version to ', version);
    await setValue('newVersion', version);
    // maybe install static resources
});

self.addEventListener('activate', async _ => {
    console.log('Activating new service worker...');
    console.log('Clearing cache ', cacheName);
    await caches.delete(cacheName);
});

addEventListener('message', messageEvent => {
    if (messageEvent.data === 'skipWaiting') return self.skipWaiting();
});

self.addEventListener('fetch', (event : FetchEvent) => {
    event.respondWith(
        caches.open(cacheName).then(async cache => {
            let response;
            try{
                response = await cache.match(event.request);
            } catch {
                response = undefined;
            }
            const fetchPromise = fetch(event.request).then(networkResponse => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
            });
            return response || fetchPromise;
        })
    );
});