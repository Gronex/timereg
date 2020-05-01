import { LitElement, html, TemplateResult } from 'lit-element';
import { Repository } from '../../shared/repository';
import { TimeRegistrationViewModel } from '../models/timeRegistrationViewModel';
import { EditTimeRegistrationEvent } from './EditTimeRegistration';
import './TimeRegistration';
import { formatTime } from '../util';

import '@material/mwc-list'

export class TimeregList extends LitElement {
  private registrations: TimeRegistrationViewModel[];
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
    return [];
  }

  async firstUpdated() {
    await this.repository.initialize();
    this.registrations = await this.repository
      .getRegistrations()
      .then(x =>
        x.map(reg => {
          return {
            ...reg,
            editing: false
          }
        })
      );
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
      <main>
        <h1>${this.title}</h1>
        <details>
          <summary>Add</summary>
          <timereg-edit-registration @save="${this.saveRegistration}"></timereg-edit-registration>
        </details>
        <hr/>
        ${this.renderRegistrations()}
      </main>
    `;
  }

  *renderRegistrations() : IterableIterator<TemplateResult> {

    const formatter = new Intl.DateTimeFormat();
    const grouped = this.groupByDate(this.registrations);

    for (const [key, registrations] of grouped) {
      var totalHours = registrations.reduce((sum, registration) => (registration.hours ?? 0) + sum, 0);

      yield html`
        <div>
          <h3>${formatter.format(key)}</h3>
          <span>${formatTime(totalHours)}</span>
          ${registrations.map(registration => html`
            <timereg-registration
              @save="${(e : EditTimeRegistrationEvent) => this.saveRegistration(e, registration.id)}"
              .registration="${registration}">
            </timereg-registration>`)
          }
        </div>
        <hr/>
      `
    }

  }

  private groupByDate(registrations : TimeRegistrationViewModel[]) {
    var map = new Map<number, TimeRegistrationViewModel[]>();

    return registrations.reduce((group : Map<number, TimeRegistrationViewModel[]>, registration) => {
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

customElements.define('timereg-list', TimeregList);
