import { LitElement, html, TemplateResult, property } from 'lit-element';
import './TimeRegistrationList';
import { formatTime, formatDateUrl } from '../util';

import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import { TimeRegistration } from '../../shared/models/timeRegistration';
import { hiddenLinkStyles } from '../styles';
import { Router } from '../router';

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

  render() {
    return html`
      <mwc-list>
        ${this.renderRegistrations()}
      </mwc-list>
      `;
  }

  *renderRegistrations() : IterableIterator<TemplateResult> {

    const formatter = new Intl.DateTimeFormat();
    const monthFormatter = new Intl.DateTimeFormat('default', {
      month: 'long'
    });
    const grouped = this.groupByDate(this.registrations);

    const weeks = new Set<number>();
    const today = new Date();
    for (const [key, registrations] of grouped) {
      const totalHours = registrations.reduce((sum, registration) => (registration.hours ?? 0) + sum, 0);

      const weekStart = this.getStartOfWeekIndex(key);
      if (!weeks.has(weekStart)){
        if (weeks.size < 2 || today.getMonth() === new Date(weekStart).getMonth()) {
          yield html`
            <mwc-list-item graphic="icon" noninteractive>
              <b>Week of ${formatter.format(weekStart)}</b>
              <mwc-icon slot="graphic">calendar_today</mwc-icon>
            </mwc-list-item>
          `
        } else {
          yield html`
            <mwc-list-item graphic="icon" noninteractive>
              <b>${monthFormatter.format(weekStart)}</b>
              <mwc-icon slot="graphic">calendar_today</mwc-icon>
            </mwc-list-item>
          `
        }
        weeks.add(weekStart);
      }

      yield html`
        <a href="/${formatDateUrl(key)}" @click="${(event : MouseEvent) => Router.current.onNavigate(event, `/${formatDateUrl(key)}`)}">
          <mwc-list-item twoline>
            <span>${formatter.format(key)}</span>
            <span slot="secondary">${formatTime(totalHours)}</span>
          </mwc-list-item>
        </a>
        <li divider role="separator"></li>
      `
    }

  }

  private getStartOfWeekIndex(date : number) {
    const typedDate = new Date(date);

    const dayOffset = typedDate.getDay() - 1; // TODO: configurable
    return typedDate.setDate(typedDate.getDate() - dayOffset);
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
