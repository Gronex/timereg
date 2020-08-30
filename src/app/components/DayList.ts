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
    const months = new Set<number>();
    const today = new Date();
    for (const [key, registrations] of grouped) {
      const totalHours = registrations.reduce((sum, registration) => (Number.isNaN(registration.hours) ? 0 : registration.hours) + sum, 0);

      const weekStart = this.getStartOfWeekIndex(key);
      const month =new Date(weekStart).getMonth();
      if (!weeks.has(weekStart) && !months.has(month)){
        if (weeks.size < 1 || today.getMonth() === month) {
          yield html`
            <mwc-list-item graphic="icon" noninteractive twoline>
              <b>Week of ${formatter.format(weekStart)}</b>
              <mwc-icon slot="graphic">calendar_today</mwc-icon>
              <span slot="secondary">${formatTime(this.summarizeTime('week', key))}</span>
              <span></span>
            </mwc-list-item>
          `
        } else {
          yield html`
            <mwc-list-item graphic="icon" noninteractive twoline>
              <b>${monthFormatter.format(weekStart)}</b>
              <mwc-icon slot="graphic">calendar_today</mwc-icon>
              <span slot="secondary">${formatTime(this.summarizeTime('month', key))}</span>
            </mwc-list-item>
          `
          months.add(month);
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

  private summarizeTime(filter: 'week' | 'month', relativeTo : number) {
    return this.registrations
      .filter(registration => {
        let selector = (date : number | Date) => {
          date = new Date(date);
          switch (filter) {
            case 'week':
              return this.getStartOfWeekIndex(date)
            case 'month':
              return date.getMonth();
            default:
              throw 'Filter not supported';
          }
        }
        return selector(relativeTo) === selector(registration.date);
      })
      .reduce((sum, registration) => {
        return sum + (Number.isNaN(registration.hours) ? 0 : registration.hours);
      }, 0);
  }

  private getStartOfWeekIndex(date : number | Date) {
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
