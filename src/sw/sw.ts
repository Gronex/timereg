// Give TypeScript the correct global.
declare var self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from 'workbox-precaching';

// const CACHE_KEY = 'timereg-v' + VERSION;

precacheAndRoute(self.__WB_MANIFEST);

export default null;
