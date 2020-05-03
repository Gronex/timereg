import { LitElement, html, TemplateResult, property } from 'lit-element';
import './TimeRegistrationList';
import { formatTime } from '../util';

import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import { TimeRegistration } from '../../shared/models/timeRegistration';
import { hiddenLinkStyles } from '../styles';

export class DayList extends LitElement {

  @property({type: Array})
  registrations: TimeRegistration[];

  constructor() {
    super();
    this.registrations = [];
  }

  static get styles() {
    return [hiddenLinkStyles()]
  }

  // async saveRegistration(event : EditTimeRegistrationEvent, id? : number) {
  //   await this.repository.updateRegistration({
  //     description: event.data.description,
  //     hours: event.data.hours,
  //     timeFrom: event.data.timeFrom,
  //     timeTo: event.data.timeTo,
  //     project: event.data.project,
  //     date: event.data.date,
  //     id
  //   });

  //   const dbRegistrations = await this.repository.getRegistrations();
  //   this.registrations = dbRegistrations.map(x => {
  //     return {
  //       ...x,
  //       editing: false
  //     }
  //   });
  // }

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
