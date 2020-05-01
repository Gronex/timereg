import { LitElement, html, property } from "lit-element";
import '../Header/Header';
import { Router } from "../../router";

import './app-styles.scss';
import '../TimeRegistrationList'

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
        callback: () => html`<timereg-day-list></timereg-day-list>`
      })
      .add({
        path: '/(.*)',
        callback: (...date) => html`<timereg-registration-list date="${date[0]}" ></timereg-registration-list>`
      })
      .startRouting();
  }

  static get styles() {
    return [];
  }

  render() {
    console.log(this.appTitle);
    return html`
    <timereg-header appTitle="${this.appTitle}"></timereg-header>
    ${this.router.outlet}
    `
  }
}

customElements.define('timereg-app', App);
