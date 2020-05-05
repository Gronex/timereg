import { LitElement, property, html } from "lit-element";
import { Repository } from "../../shared/repository";
import { TimeRegistration } from "../../shared/models/timeRegistration";
import '../components/EditTimeRegistration';
import { formatDateUrl } from "../util";
import { TimeRegistrationForm } from "../components/EditTimeRegistration";
import { Router } from "../router";

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
        Router.current.navigate('/');
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
    Router.current.navigate('/');
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

    Router.current.navigate(`/${formatDateUrl(data.date)}`);
  }
}

customElements.define('timereg-edit-page', EditPage);
