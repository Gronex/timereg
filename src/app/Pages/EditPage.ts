import { LitElement, property, html } from "lit-element";
import { Repository } from "../../shared/repository";
import { TimeRegistration } from "../../shared/models/timeRegistration";
import '../components/EditTimeRegistration';
import { formatDateUrl } from "../util";
import { TimeRegistrationForm } from "../components/EditTimeRegistration";

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
        window.history.pushState(null, 'home', '');
      }
      this.registration = await repo.getRegistration(id);
      this.requestUpdate();
    }
  }

  render() {
    if (!this.registration) return;

    return html`
    <h2>Edit ${this.registrationId}</h2>
    <timereg-edit-registration .registration="${this.registration}" @save="${this.save}" @delete="${this.delete}"></timereg-edit-registration>
    `;
  }

  async delete(event : CustomEvent<number>){
    const repo = await Repository.getCurrent();

    await repo.remove(event.detail);
    window.history.pushState(null, 'home', '/');
  }

  async save(event : CustomEvent<TimeRegistrationForm>) {
    const repo = await Repository.getCurrent();
    const data = event.detail
    await repo.updateRegistration({
      date: data.date,
      hours: data.hours,
      description: data.description,
      project: data.project,
      id: this.registration?.id,
      serverId: this.registration?.serverId,
      timeFrom: NaN,
      timeTo: NaN
    });

    window.history.pushState(null, 'home', `/${formatDateUrl(data.date)}`);
  }
}

customElements.define('timereg-edit-page', EditPage);
