import { LitElement, html, css, property } from 'lit-element';
import { TimeRegistration as Registration } from './models/timeRegistration';

export class TimeRegistration extends LitElement {

  @property({type: Object})
  registration?: Registration;

  static get styles(){
    return css`
    `;
  }

  render() {

    if(!this.registration){
      return;
    }
    const formatter = new Intl.DateTimeFormat();
    return html`
      <div>
        ${formatter.format(this.registration.date)} <br />
        ${this.registration.time} <br/>
        ${this.registration.description}
      </div>
    `;
  }
}
