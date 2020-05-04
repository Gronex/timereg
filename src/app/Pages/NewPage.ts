import { LitElement, html } from "lit-element";
import '../components/EditTimeRegistration';
import { TimeRegistrationForm } from "../components/EditTimeRegistration";
import { Repository } from "../../shared/repository";

export class NewPage extends LitElement {

  render() {
    return html`
    <h2>New Registration</h2>
    <timereg-edit-registration @save="${this.save}"></timereg-edit-registration>
    `;
  }

  async save(event : CustomEvent<TimeRegistrationForm>) {
    var repo = await Repository.getCurrent();
    const data = event.detail;
    await repo.updateRegistration({
      date: data.date,
      hours: data.hours,
      description: data.description,
      project: data.project,
      timeFrom: NaN,
      timeTo: NaN
    });

    window.history.pushState(null, 'home', '/');
  }
}

customElements.define('timereg-new-page', NewPage);
