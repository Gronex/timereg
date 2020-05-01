import { LitElement, html, property } from "lit-element";
import '@material/mwc-top-app-bar';

export class Header extends LitElement {

  @property({type : String})
  appTitle?: string;

  static get styles() {
    return [];
  }

  render() {
    return html`
    <mwc-top-app-bar>
      <div slot="title">${this.appTitle}</div>
    </mwc-top-app-bar>
    `
  }

}

customElements.define('timereg-header', Header);
