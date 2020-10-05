import { ADD_REGISTRATION, DELETE_REGISTRATION, Registration } from './types';

export function addRegistration(registration: Registration) {
    return {
        type: ADD_REGISTRATION,
        registration: registration
    }
}

export function removeRegistration(id: string) {
    return {
        type: DELETE_REGISTRATION,
        id: id
    }
}