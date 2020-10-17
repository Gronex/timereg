export interface RegistrationState {
    registrations: Registration[],
    editing?: Registration
}

export interface Registration {
    id?: number;
    dateStamp : number;
    project?: string;
    description?: string;
    time : number;
}

export const ADD_REGISTRATION = 'ADD_REGISTRATION';
export const DELETE_REGISTRATION = 'DELETE_REGISTRATION';
export const EDIT_REGISTRATION_FIELD = 'EDIT_REGISTRATION_FIELD';
export const SUBMIT_REGISTRATION = 'SUBMIT_REGISTRATION';

interface AddRegistrationAction {
    type: typeof ADD_REGISTRATION,
    id: number
}

interface DeleteRegistrationAction {
    type: typeof DELETE_REGISTRATION,
    id: number
}

interface EditField {
    type: typeof EDIT_REGISTRATION_FIELD,
    registration: Registration
}

interface SubmitRegistration {
    type: typeof SUBMIT_REGISTRATION
}
export type RegistrationActionTypes = AddRegistrationAction | DeleteRegistrationAction | EditField | SubmitRegistration