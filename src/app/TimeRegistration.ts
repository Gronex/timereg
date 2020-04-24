import { LitElement, html, css, property } from 'lit-element';
import { TimeRegistrationViewModel } from './models/timeRegistrationViewModel';

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

    const hours = (this.registration.hours ?? 0);

    const ishour = hours >= 1;

    const formatter = new Intl.NumberFormat(undefined, {
      style: 'unit',
      unit: ishour ? 'hour' : 'minute',
      unitDisplay: "long"
    });
    return html`
  <details>
    <summary>
      ${formatter.format(ishour ? hours : hours * 60)}
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
