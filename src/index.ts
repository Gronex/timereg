import "./app/gronia-timereg";

import runtime from 'serviceworker-webpack-plugin/lib/runtime';

if ('serviceWorker' in navigator) {
  runtime.register();
}
