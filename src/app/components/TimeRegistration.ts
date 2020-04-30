import { LitElement, html, css, property } from 'lit-element';
import { TimeRegistrationViewModel } from '../models/timeRegistrationViewModel';
import { formatTime } from '../util';

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
    <gronia-edit-time-registration .registration="${this.registration}"></gronia-edit-time-registration>
  </details>
    `;
  }

  renderEditMode(){
    if(this.registration?.editing){
      return html`
        <gronia-edit-time-registration .registration="${this.registration}"></gronia-edit-time-registration>`;
    }
  }
}
