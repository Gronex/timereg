import { LitElement, property, html } from "lit-element";
import { TimeRegistration } from "../../shared/models/timeRegistration";
import { Repository } from "../../shared/repository";

import '../components/TimeRegistrationList';

export class RegistrationListPage extends LitElement {

  registrations : TimeRegistration[];

  @property({type: String})
  date: string;

  constructor() {
    super();
    this.registrations = [];
    this.date = '';
  }

  async firstUpdated() {
    const typedDate = new Date(this.date);
    this.registrations = await Repository.getCurrent().then(x => x.getRegistrationsByDate(typedDate));
    this.requestUpdate();
  }

  render() {
    return html`
      <timereg-registration-list .registrations="${this.registrations}"></timereg-registration-list>
    `;
  }

}

customElements.define('timereg-registration-list-page', RegistrationListPage);
