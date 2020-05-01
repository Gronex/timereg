import { LitElement, html, css, property } from 'lit-element';
import { formatTime } from '../util';

import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import { Repository } from '../../shared/repository';
import { TimeRegistration } from '../../shared/models/timeRegistration';

export class TimeRegistrationList extends LitElement {

  @property({type: String})
  date: string;

  registrations: TimeRegistration[];
  repository: Repository;

  constructor() {
    super();
    this.registrations = [];
    this.date = '';
    this.repository = new Repository();
  }

  static get styles(){
    return css`
    `;
  }

  async firstUpdated() {
    await this.repository.initialize();
    this.registrations = await this.repository
      .getRegistrationsByDate(new Date(this.date));

      this.requestUpdate();
  }

  render() {
    return html`
      <mwc-list>
        <h1>${this.date}</h1>
        ${this.registrations.map(reg => html`
          <mwc-list-item twoline>
            <span>${reg.description}</span>
            <span slot="secondary">${formatTime(reg.hours)}</span>
          </mwc-list-item>
          <li divider role="separator"></li>`
        )}
      </mwc-list>
      `;
  }
}

customElements.define('timereg-registration-list', TimeRegistrationList);
