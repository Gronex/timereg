export interface RegistrationState {
    registrations: Registration[]
}

export interface Registration {
    id: string;
    dateStamp : number;
    project : string;
    description : string;
    time : number;
}

export const ADD_REGISTRATION = 'ADD_REGISTRATION';
export const DELETE_REGISTRATION = 'DELETE_REGISTRATION';

interface AddRegistrationAction {
    type: typeof ADD_REGISTRATION,
    registration: Registration
}

interface DeleteRegistrationAction {
    type: typeof DELETE_REGISTRATION,
    id: string
}

export type RegistrationActionTypes = AddRegistrationAction | DeleteRegistrationAction