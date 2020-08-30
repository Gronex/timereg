import { LitElement, html, property, css } from 'lit-element';
import { formatTime } from '../util';

import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import { TimeRegistration } from '../../shared/models/timeRegistration';
import { hiddenLinkStyles } from '../styles';
import { Router } from '../router';

export class TimeRegistrationList extends LitElement {

  @property({type: Array})
  registrations: TimeRegistration[];

  constructor() {
    super();
    this.registrations = [];
  }

  static get styles(){
    return [hiddenLinkStyles(), this.localStyles()];
  }

  static localStyles() {
    return css`
      .unfocus {
        color: rgba(0,0,0,.54)
      }
    `;
  }

  render() {
    return html`
      <mwc-list>
        ${this.registrations.map(reg => html`
        <a href="/edit/${reg.id}" @click="${(event : MouseEvent) => Router.current.onNavigate(event, `/edit/${reg.id}`)}">
          <mwc-list-item twoline >
            <span>
              <span class="unfocus">${reg.project} - </span>
              <span>${reg.description}</span>
            </span>
            <span slot="secondary">
              <span>${formatTime(reg.hours)}</span>
            </span>
          </mwc-list-item>
          <li divider role="separator"></li>
        </a>`
        )}
      </mwc-list>
      `;
  }
}

customElements.define('timereg-registration-list', TimeRegistrationList);
