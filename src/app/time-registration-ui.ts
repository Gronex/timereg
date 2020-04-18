import { LitElement, html, css } from 'lit-element';

export class Registration extends LitElement {

  date?: Date;

  static get properties() {
    return {
      date: { type: String },
    };
  }

  static get styles(){
    return css`
    `;
  }

  render() {
    return html`
      <li>
        ${this.date}
      </li>
    `;
  }
}
