// Only here to clean up old service worker that should have been deleted previously

self.addEventListener('install', async _ => {
    (await caches.keys()).forEach(x => {
        console.log('Deleted cache ', x);
        caches.delete(x);
    });
});