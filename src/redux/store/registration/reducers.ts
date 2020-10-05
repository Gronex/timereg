import { RegistrationActionTypes, RegistrationState } from './types';

const initialState : RegistrationState = {
    registrations: []
}

export function registrationReducer(state = initialState, action: RegistrationActionTypes) : RegistrationState {
    switch(action.type){
        case "ADD_REGISTRATION":
            return {
                registrations: [...state.registrations, action.registration]
            };

        case "DELETE_REGISTRATION":
            return {
                registrations: state.registrations.filter(x => x.id === action.id)
            }
        
        default:
            return state;
    }
}