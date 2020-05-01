import { LitElement, html, property } from "lit-element";
import '../Header/Header';
import { Router } from "../../router";

import './app-styles.scss';

export class App extends LitElement {

  @property()
  appTitle!: string;

  private router: Router;

  /**
   *
   */
  constructor() {
    super();
    this.router = new Router();
  }

  static get styles() {
    return [];
  }

  render() {
    console.log(this.appTitle);
    return html`
    <timereg-header appTitle="${this.appTitle}"></timereg-header>
    ${this.router.renderRoute()}
    `
  }
}

customElements.define('timereg-app', App);
