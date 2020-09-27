import { LitElement, html, property, css } from "lit-element";
import '@material/mwc-top-app-bar';
import '@material/mwc-icon';
import '@material/mwc-icon-button';
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
      <div slot="actionItems">v${VERSION}</div>
      <a href="https://github.com/Gronex/timereg/issues" slot="actionItems" target="_blank">
        <mwc-icon-button label="Github Issues" icon="bug_report"></mwc-icon-button>
      </a>
    </mwc-top-app-bar>
    `
  }

}

customElements.define('timereg-header', Header);
