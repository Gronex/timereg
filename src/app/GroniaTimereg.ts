import { LitElement, html, css, PropertyValues } from 'lit-element';
import { openDB, IDBPDatabase } from 'idb';
import { TimeRegistration } from './time-registration';
import { TimeregDB } from './TimeregDB';

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

  async insertMock() {
    const registration = {
      date: new Date(),
      description: `Did a thing ${Math.random()} times`,
      id: (new Date()).getTime() + Math.random().toString()
    };
    await this.db.add('registrations', registration);
    this.registrations = [...this.registrations, registration];
  }

  render() {
    return html`
      <main>
        <h1>${this.title}</h1>
        <button @click="${this.insertMock}">Add data</button>
        ${this.renderRegistrations()}
      </main>
    `;
  }

  renderRegistrations() {
    return this.registrations.map(
      registration =>
        html`<gronia-time-registration date="${registration.date.toDateString()}"></gronia-time-registration>`
    );
  }
}
