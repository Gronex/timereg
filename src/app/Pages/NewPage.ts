import { LitElement, html } from "lit-element";
import '../components/EditTimeRegistration';

export class NewPage extends LitElement {


  render() {

    return html`
    <h2>New Registration</h2>
    <timereg-edit-registration></timereg-edit-registration>
    `;
  }
}

customElements.define('timereg-new-page', NewPage);
