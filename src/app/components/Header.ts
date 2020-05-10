import { LitElement, html, property, css } from "lit-element";
import '@material/mwc-top-app-bar';
import { Router } from "../router";

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
      <a href="/" slot="title" @click="${(event : MouseEvent) => Router.current.onNavigate(event, '/')}" >${this.appTitle}</a>
      <div slot="actionItems">Version: ${VERSION.Major}.${VERSION.Minor}.${VERSION.Patch}</div>
    </mwc-top-app-bar>
    `
  }

}

customElements.define('timereg-header', Header);
