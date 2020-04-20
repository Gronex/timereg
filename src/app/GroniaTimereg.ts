import { LitElement, html, css, PropertyValues, TemplateResult } from 'lit-element';
import { openDB, IDBPDatabase } from 'idb';
import { TimeregDB } from './TimeregDB';
import {TimeRegistration } from './models/timeRegistration';

export class GroniaTimereg extends LitElement {
  registrations: TimeRegistration[];

  db! : IDBPDatabase<TimeregDB>;

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
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
      }

      main {
        flex-grow: 1;
      }

      .logo > svg {
        margin-top: 36px;
        animation: app-logo-spin infinite 20s linear;
      }

      @keyframes app-logo-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }
    `;
  }

  async firstUpdated() {
    this.db = await openDB<TimeregDB>('timereg-db', 1, {
      upgrade (db){
        const store = db.createObjectStore('registrations',{
          keyPath: 'id'
        });
        store.createIndex('by-date', 'date');
      }
    });

    const registrations = await this.db.getAllFromIndex('registrations', 'by-date');
    this.registrations = registrations;
  }

  update(changedProperty : PropertyValues) {
    console.log("update!");
    super.update(changedProperty);
  }

  async insertMock(date : Date) {
    const registration = {
      date: date,
      description: `Did a thing ${Math.random()*100} times`,
      id: (new Date()).getTime() + Math.random().toString(),
      time: Math.random()*10
    };
    await this.db.add('registrations', registration);
    this.registrations = [...this.registrations, registration];
  }

  render() {
    return html`
      <main>
        <h1>${this.title}</h1>
        ${this.renderRegistrations()}
      </main>
    `;
  }

  *renderRegistrations() : IterableIterator<TemplateResult> {

    const formatter = new Intl.DateTimeFormat();
    const grouped = this.groupByDate(this.registrations);

    for (const [key, registrations] of grouped) {
      yield html`
        <div>
          <span>${formatter.format(key)}</span><button @click="${() => this.insertMock(new Date(key))}">+</button>
          <ul>
            <li>${registrations.map(registration => html`<gronia-time-registration .registration="${registration}"></gronia-time-registration>`)}</li>
          </ul>
        </div>
      `
    }

  }

  private groupByDate(registrations : TimeRegistration[]) {
    var map = new Map<number, TimeRegistration[]>();
    map.set(new Date().setUTCHours(0,0,0,0), [])

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
