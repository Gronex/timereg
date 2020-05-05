import { LitElement, html, property, query, css } from 'lit-element';
import '@material/mwc-button';
import '@material/mwc-textfield';
import { TimeRegistration } from '../../shared/models/timeRegistration';
import { TextField } from '@material/mwc-textfield';

export class EditTimeRegistration extends LitElement {

  @property({type: Object})
  registration?: TimeRegistration;

  @query('#date')
  private date!: TextField

  @query('#description')
  private description!: TextField

  @query('#project')
  private project!: TextField

  @query('#hours')
  private hours!: TextField

  static get styles() {
    return css`
    .centering {
      text-align: center;
    }

    mwc-button {
      margin: 10px 5% 10px 5%;
    }

    .align-left {
      float: left;
    }

    .align-right {
      float: right;
    }

    mwc-textfield {
      margin: 10px;
      width: 90%
    }
    `;
  }

  render() {
    let dateString = this.registration?.date.toISOString();
    dateString = dateString?.substring(0, dateString.indexOf('T')) ?? '';

    return html`
        <form @submit="${this.onSubmit}">
          <div class="centering">
            <mwc-textfield icon="event" label="Date" type='date' id='date' value='${this.formatDate(this.registration?.date)}'></mwc-textfield>
            <mwc-textfield icon="description" label="Description" type='text' id='description' value='${this.registration?.description ?? ''}'></mwc-textfield>
            <mwc-textfield icon="domain" label="Project" type='text' id='project' value='${this.registration?.project ?? ''}'></mwc-textfield>
            <mwc-textfield icon="timer" label="Hours" type='number' id='hours' step="0.01" value='${this.registration?.hours ?? ''}'></mwc-textfield>
            <!-- <mwc-textfield label="From" type='time' id='timeFrom' fullWidth value='${this.formatTime(this.registration?.timeFrom)}' ></mwc-textfield>
            <mwc-textfield label="To" type='time' id='timeTo' fullWidth value='${this.formatTime(this.registration?.timeTo)}' ></mwc-textfield> -->
          </div>
          <mwc-button class="align-left" raised @click="${this.onSubmit}" icon="save" label="Save"></mwc-button>
          ${this.registration ? html`<mwc-button class="align-right" @click="${this.onDelete}" outlined icon="delete" trailingIcon label="Delete"></mwc-button>` : ''}
        </form>
    `;
  }

  onSubmit(event : Event) {
    event.preventDefault();
    const form = this.shadowRoot?.querySelector('form') ?? undefined;
    if(!form){
      return false;
    }
    if (form.reportValidity()){
      const model = this.convertToObject(form);
      this.dispatchEvent(new CustomEvent('save', {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: model,
      }));

      // Reset the form
      this.requestUpdate();
    }

    return false;
  }

  onDelete(event : Event) {
    this.dispatchEvent(new CustomEvent('delete', {
      detail: this.registration?.id,
      bubbles: true,
      cancelable: true,
      composed: true
    }));
  }

  private convertToObject(form : HTMLFormElement) : TimeRegistrationForm {
    return {
      description: this.description.value ?? '',
      timeFrom: NaN,
      timeTo: NaN,
      hours: Number.parseFloat(this.hours.value),
      project: this.project.value,
      date: new Date(this.date.value)
    };
  }

  private formatDate(date? : Date) {
    let dateString = (date ?? new Date()).toISOString();
    return dateString.substring(0, dateString.indexOf('T'));
  }

  private formatTime(time? : number) {

    if(!time) {
      return '';
    }

    const minutes = Math.floor(time / 1000 / 60 / 60);
    const hours = Math.floor(minutes / 60);
    const minString = minutes.toString().padStart(2, '0');
    const hourString = hours.toString().padStart(2, '0');
    return `${hourString}:${minString}`;
  }
}

customElements.define('timereg-edit-registration', EditTimeRegistration);

export interface TimeRegistrationForm {
  hours: number;
  timeFrom: number;
  timeTo: number;
  description?: string;
  project?: string;
  date : Date;
}
