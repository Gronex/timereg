import { LitElement, html, css, property, Constructor } from 'lit-element';
import { TimeRegistrationViewModel } from './models/timeRegistrationViewModel';

export class EditTimeRegistration extends LitElement {

  @property({type: Object})
  registration?: TimeRegistrationViewModel;

  render() {
    let dateString = this.registration?.date.toISOString();
    dateString = dateString?.substring(0, dateString.indexOf('T')) ?? '';

    return html`<h2>Edit</h2>
    <form @submit="${this.onSubmit}">
      <div>
        <label for='date'>Date</label>
        <input type='date' name='date' value='${dateString}' />
      </div>
      <div>
        <label for='description'>Description</label>
        <input type='text' name='description' value='${this.registration?.description ?? ''}' />
      </div>
      <div>
        <label for='project'>Project</label>
        <input type='text' name='project' value='${this.registration?.description ?? ''}' />
      </div>
      <div>
        <label for='hours'>Hours</label>
        <input type='number' name='hours' value='${this.registration?.hours ?? ''}' />
      </div>
      <div>
        <label for='timeFrom'>From</label>
        <input type='time' name='timeFrom' value='${this.registration?.timeFrom ?? ''}' />
      </div>
      <div>
        <label for='timeTo'>To</label>
        <input type='time' name='timeTo' value='${this.registration?.timeTo ?? ''}' />
      </div>
      <button type="submit">Save</button>
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
      if (model) {
        this.dispatchEvent(new EditTimeRegistrationEvent('save', {
          bubbles: true,
          cancelable: true,
          composed: true,
          data: model,
        }));
      }
    }

    return false;
  }

  private convertToObject(form : HTMLFormElement) : TimeRegistrationForm | null {

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
}

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
