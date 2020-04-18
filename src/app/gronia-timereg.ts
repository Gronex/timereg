import { GroniaTimereg } from './GroniaTimereg';
import { Registration } from './time-registration-ui';

customElements.define('gronia-timereg', GroniaTimereg);
customElements.define('gronia-time-registration', Registration);


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./dist/sw.js', )
    .then(reg => {
      console.log("Registration succeeded");
    })
    .catch(error => {
      console.log('Registration failed with ' + error);
    })
}
