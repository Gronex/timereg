import { LitElement, property, html } from "lit-element";
import { Repository } from "../../shared/repository";
import { TimeRegistration } from "../../shared/models/timeRegistration";
import '../components/EditTimeRegistration';

export class EditPage extends LitElement {

  @property({type : String})
  registrationId? : string

  registration?: TimeRegistration;

  async firstUpdated() {
    const repo = await Repository.getCurrent();
    let id = -1;
    try{
      if (this.registrationId) {
        id = Number.parseInt(this.registrationId);
      }
    }
    finally {
      if(!id) {
        // todo: navigate to main screen
      }
      this.registration = await repo.getRegistration(id);
      this.requestUpdate();
    }
  }

  render() {
    if (!this.registration) return;

    return html`
    <h2>Edit ${this.registrationId}</h2>
    <timereg-edit-registration .registration="${this.registration}"></timereg-edit-registration>
    `;
  }
}

customElements.define('timereg-edit-page', EditPage);
