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
                registrations: state.registrations.filter(x => x.id !== action.id)
            }

        case "UPDATE_REGISTRATION":
            var regIndex = state.registrations.findIndex(x => x.id === action.id);
            return {
                registrations: [
                    ...state.registrations.slice(0, regIndex),
                    action.registration,
                    ...state.registrations.slice(regIndex + 1, state.registrations.length)
                ]
            }

        default:
            return state;
    }
}