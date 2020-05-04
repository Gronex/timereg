import { LitElement, html, property, css } from "lit-element";
import '../Header';
import { Router } from "../../router";
import '@material/mwc-fab';
import '@material/mwc-icon';
import './app-styles.scss';
import '../../Pages';

export class App extends LitElement {

  @property()
  appTitle!: string;

  private router: Router;

  constructor() {
    super();
    this.router = new Router();
    this.router
      .add({
        path: '/',
        callback: () => html`<timereg-overview-page></timereg-overview-page>`
      })
      .add({
        path: '/(\\d{4}-\\d{2}-\\d{2})',
        callback: (...args) => html`<timereg-registration-list-page date="${args[0]}"></timereg-registration-list-page>`
      })
      .add({
        path: '/edit/(.*)',
        callback: (...args) => html`<timereg-edit-page registrationId="${args[0]}"></timereg-edit-page>`
      })
      .add({
        path: '/new',
        callback: () => html`<timereg-new-page></timereg-new-page>`
      })
      .startRouting();
  }

  static get styles() {
    return css`
    .fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
    }
    `;
  }

  render() {
    console.log(this.appTitle);
    return html`
    <timereg-header appTitle="${this.appTitle}"></timereg-header>
    ${this.router.outlet}
    <mwc-fab class="fab" label="add" icon="add" @click="${() => window.history.pushState(null, 'Add', '/new')}"></mwc-fab>
    `
  }
}

customElements.define('timereg-app', App);
