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
  <div>
    <div  @click="${this.toggleEditing}">
      ${formatter.format(ishour ? hours : hours * 60)} <br/>
      ${this.registration.description}
    </div>
    ${this.renderEditMode()}
  </div>
    `;
  }

  private toggleEditing() {
    if(this.registration){
      this.registration.editing = !this.registration?.editing;
    }
    this.requestUpdate();
  }

  renderEditMode(){
    if(this.registration?.editing){
      return html`
        <gronia-edit-time-registration .registration="${this.registration}"></gronia-edit-time-registration>`;
    }
  }
}
