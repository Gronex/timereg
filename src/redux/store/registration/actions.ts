import { ADD_REGISTRATION, DELETE_REGISTRATION, EDIT_REGISTRATION_FIELD, Registration, SUBMIT_REGISTRATION } from './types';

export function addRegistration() {
    return {
        type: ADD_REGISTRATION
    }
}

export function removeRegistration(id: string) {
    return {
        type: DELETE_REGISTRATION,
        id: id
    }
}

export function editRegistration(registration : Registration) {
    return {
        type: EDIT_REGISTRATION_FIELD,
        registration: registration
    }
}

export function SubmitRegistration() {
    return {
        type: SUBMIT_REGISTRATION
    }
}