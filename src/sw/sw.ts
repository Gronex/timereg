// Give TypeScript the correct global.
declare var self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST);

export default null;
