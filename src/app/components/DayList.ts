import { LitElement, html, TemplateResult, css } from 'lit-element';
import { Repository } from '../../shared/repository';
import { EditTimeRegistrationEvent } from './EditTimeRegistration';
import './TimeRegistrationList';
import { formatTime } from '../util';

import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import { TimeRegistration } from '../../shared/models/timeRegistration';

export class DayList extends LitElement {
  private registrations: TimeRegistration[];
  private repository: Repository;

  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
      registrations: {type: Array}
    };
  }

  /**
   *
   */
  constructor() {
    super();
    this.registrations = [];
    this.repository = new Repository();
  }

  static get styles() {
    return css`
      a {
        text-decoration: none;
      }
    `;
  }

  async firstUpdated() {
    await this.repository.initialize();
    this.registrations = await this.repository
      .getRegistrations();
  }

  async saveRegistration(event : EditTimeRegistrationEvent, id? : number) {
    await this.repository.updateRegistration({
      description: event.data.description,
      hours: event.data.hours,
      timeFrom: event.data.timeFrom,
      timeTo: event.data.timeTo,
      project: event.data.project,
      date: event.data.date,
      id
    });

    const dbRegistrations = await this.repository.getRegistrations();
    this.registrations = dbRegistrations.map(x => {
      return {
        ...x,
        editing: false
      }
    });
  }

  render() {
    return html`
      <mwc-list>
        ${this.renderRegistrations()}
      </mwc-list>
      `;
  }

  *renderRegistrations() : IterableIterator<TemplateResult> {

    const formatter = new Intl.DateTimeFormat();
    const grouped = this.groupByDate(this.registrations);

    const formatDateUrl = (date : number | Date) => {
      date = new Date(date);

      const isoString = date.toISOString();
      return isoString.split('T')[0];
    }

    for (const [key, registrations] of grouped) {
      var totalHours = registrations.reduce((sum, registration) => (registration.hours ?? 0) + sum, 0);

      yield html`
        <a href="/${formatDateUrl(key)}">
          <mwc-list-item twoline>
            <span>${formatter.format(key)}</span>
            <span slot="secondary">${formatTime(totalHours)}</span>
          </mwc-list-item>
        </a>
        <li divider role="separator"></li>
      `
          // ${registrations.map(registration => html`
          //   <timereg-registration
          //     @save="${(e : EditTimeRegistrationEvent) => this.saveRegistration(e, registration.id)}"
          //     .registration="${registration}">
          //   </timereg-registration>`)
          // }
    }

  }

  private groupByDate(registrations : TimeRegistration[]) {
    var map = new Map<number, TimeRegistration[]>();

    return registrations.reduce((group : Map<number, TimeRegistration[]>, registration) => {
      const date = registration.date.setUTCHours(0,0,0,0);
      if(!group.has(date)){
        group.set(date, [registration]);
      }
      else {
        let localGroup = group.get(date);
        localGroup?.push(registration);
      }
      return group;
    }, map);
  }

}

customElements.define('timereg-day-list', DayList);
