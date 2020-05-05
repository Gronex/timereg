// Give TypeScript the correct global.
declare var self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from 'workbox-precaching';
import {skipWaiting, clientsClaim} from 'workbox-core';

precacheAndRoute(self.__WB_MANIFEST);


self.addEventListener('message', async event => {
  switch (event.data.action) {
    case 'skipWaiting':
      await self.skipWaiting();
      skipWaiting();
      clientsClaim();
      break;
  }
});

console.log('SW version: ', VERSION);
export default null;
