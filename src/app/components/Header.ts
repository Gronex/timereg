import { LitElement, html, property, css } from "lit-element";
import '@material/mwc-top-app-bar';

export class Header extends LitElement {

  @property({type : String})
  appTitle?: string;

  static get styles() {
    return css`
    a {
      text-decoration: inherit;
      color: inherit;
    }
    `;
  }

  render() {
    return html`
    <mwc-top-app-bar>
      <a href="/" slot="title">${this.appTitle}</a>
    </mwc-top-app-bar>
    `
  }

}

customElements.define('timereg-header', Header);
