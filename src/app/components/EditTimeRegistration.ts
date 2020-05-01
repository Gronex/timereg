import { LitElement, html, property } from 'lit-element';
import { TimeRegistrationViewModel } from '../models/timeRegistrationViewModel';
import '@material/mwc-button';

export class EditTimeRegistration extends LitElement {

  @property({type: Object})
  registration?: TimeRegistrationViewModel;

  static get styles() {
    return [];
  }

  render() {
    let dateString = this.registration?.date.toISOString();
    dateString = dateString?.substring(0, dateString.indexOf('T')) ?? '';

    return html`<h2>Edit</h2>
    <form @submit="${this.onSubmit}">
      <div>
        <label for='date'>Date</label>
        <input type='date' name='date' value='${this.formatDate(this.registration?.date)}' required />
      </div>
      <div>
        <label for='description'>Description</label>
        <input type='text' name='description' value='${this.registration?.description ?? ''}' />
      </div>
      <div>
        <label for='project'>Project</label>
        <input type='text' name='project' value='${this.registration?.project ?? ''}' />
      </div>
      <div>
        <label for='hours'>Hours</label>
        <input type='number' step="0.01" name='hours' value='${this.registration?.hours ?? ''}' />
      </div>
      <!-- <div>
        <label for='timeFrom'>From</label>
        <input type='time' name='timeFrom' value='${this.formatTime(this.registration?.timeFrom)}' />
      </div>
      <div>
        <label for='timeTo'>To</label>
        <input type='time' name='timeTo' value='${this.formatTime(this.registration?.timeTo)}' />
      </div> -->
      <mwc-button @click="${this.onSubmit}" outlined label="Save"></mwc-button>
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
      this.dispatchEvent(new EditTimeRegistrationEvent('save', {
        bubbles: true,
        cancelable: true,
        composed: true,
        data: model,
      }));

      // Reset the form
      this.requestUpdate();
    }

    return false;
  }

  private convertToObject(form : HTMLFormElement) : TimeRegistrationForm {

    let date = (form["date"] as HTMLInputElement)?.valueAsDate;
    if(!date){
      throw new Error('Date element was not found');
    }

    return {
      description: (form["description"] as HTMLInputElement)?.value ?? NaN,
      timeFrom: (form["timeFrom"] as HTMLInputElement)?.valueAsNumber ?? NaN,
      timeTo: (form["timeTo"] as HTMLInputElement)?.valueAsNumber ?? NaN,
      hours: (form["hours"] as HTMLInputElement)?.valueAsNumber,
      project: (form["project"] as HTMLInputElement)?.value,
      date: date
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

interface TimeRegistrationForm {
  hours: number;
  timeFrom: number;
  timeTo: number;
  description?: string;
  project?: string;
  date : Date;
}

export class EditTimeRegistrationEvent extends Event {

  data : TimeRegistrationForm
  /**
   *
   */
  constructor(type : string, eventInitDict: EventInit & {data: TimeRegistrationForm}) {
    super(type, eventInitDict);
    this.data = eventInitDict.data;
  }
}
