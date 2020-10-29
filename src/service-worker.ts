import { SettingsRepository } from "./services/SettingsRepository";
import { version } from '../package.json';

export default null;


declare var self: ServiceWorkerGlobalScope;

const cacheName = 'timereg-resource-cache';

self.addEventListener('install', async _ => {
    const settings = await SettingsRepository.getCurent();
    console.log('setting version to ', version);
    await settings.setValue('newVersion', version);
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

            if(!response) {
                console.log('caching response from ', event.request.url);
                response = await fetch(event.request);
                cache.put(event.request, response.clone());
            }
            return response
        })
    );
});