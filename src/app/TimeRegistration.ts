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
    return html`
  <details>
    <summary>
      ${this.formatTime(this.registration.hours)}
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

  private formatTime(time? : number) {
    const hours = (time ?? 0);
    const ishour = hours >= 1;
    try {
      const formatter = new Intl.NumberFormat(undefined, {
        style: 'unit',
        unit: ishour ? 'hour' : 'minute',
        unitDisplay: "long"
      });

      return formatter.format(ishour ? hours : hours * 60);
    }
    catch {
      return `${hours} hours`;
    }
  }
}
