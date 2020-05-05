import { html, LitElement } from "lit-element";
import { TimeRegistration } from "../../shared/models/timeRegistration";
import { Repository } from "../../shared/repository";
import '../components/DayList'

export class OverviewPage extends LitElement {

  registrations : TimeRegistration[];

  constructor() {
    super();
    this.registrations = [];
  }

  async firstUpdated() {
      this.registrations = await Repository.getCurrent().then(x => x.getRegistrations());
      this.requestUpdate();
  }

  render() {
    return html`
      <timereg-day-list .registrations="${this.registrations}"></timereg-day-list>
    `;
  }
}

customElements.define('timereg-overview-page', OverviewPage);

