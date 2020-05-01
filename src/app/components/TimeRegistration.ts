import { LitElement, html, css, property } from 'lit-element';
import { TimeRegistrationViewModel } from '../models/timeRegistrationViewModel';
import { formatTime } from '../util';
import './EditTimeRegistration';

export class TimeRegistration extends LitElement {

  @property({type: Object})
  registration?: TimeRegistrationViewModel;

  static get styles(){
    return css`
    `;
  }

  render() {

    if(!this.registration){
      return;
    }
    return html`
  <details>
    <summary>
      ${formatTime(this.registration.hours)}
      <span>-</span>
      ${this.registration.description}
    </summary>
    <timereg-edit-registration .registration="${this.registration}"></timereg-edit-registration>
  </details>
    `;
  }
}

customElements.define('timereg-registration', TimeRegistration);
