// Give TypeScript the correct global.
declare var self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('message', async event => {
  switch (event.data.action) {
    case 'skipWaiting':
      await self.skipWaiting();
      break;
  }
});

export default null;
