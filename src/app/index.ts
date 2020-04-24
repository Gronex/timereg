import "./gronia-timereg";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
