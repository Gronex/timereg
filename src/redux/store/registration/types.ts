export interface RegistrationState {
    registrations: Registration[]
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
export const UPDATE_REGISTRATION = 'UPDATE_REGISTRATION';

interface AddRegistrationAction {
    type: typeof ADD_REGISTRATION,
    registration: Registration
}

interface DeleteRegistrationAction {
    type: typeof DELETE_REGISTRATION,
    id: number
}

interface UpdateRegistration {
    type: typeof UPDATE_REGISTRATION,
    id: number,
    registration: Registration
}
export type RegistrationActionTypes = AddRegistrationAction | DeleteRegistrationAction | UpdateRegistration