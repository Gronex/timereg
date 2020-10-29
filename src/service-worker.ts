export default null;


declare var self: ServiceWorkerGlobalScope;

const cacheName = 'timereg-resource-cache';

// self.addEventListener('install', event => {
 // maybe install static resources
// });

self.addEventListener('activate', async event => {
    console.log('Activating new service worker...');
    await caches.delete(cacheName);
});

self.addEventListener('fetch', (event : FetchEvent) => {
    console.log("interceptet fetch ", event.request.url);
    event.respondWith(
        caches.open(cacheName).then(async cache => {
            let response;
            try{
                response = await cache.match(event.request);
            } catch {
                console.log('aweful shit happened');
                response = undefined;
            }

            if(!response) {
                response = await fetch(event.request);
                cache.put(event.request, response.clone());
            }
            return response
        })
    );
});