import { RegistrationActionTypes, RegistrationState } from './types';

const initialState : RegistrationState = {
    registrations: []
}

export function registrationReducer(state = initialState, action: RegistrationActionTypes) : RegistrationState {
    switch(action.type){
        case "ADD_REGISTRATION":
            if (!state.editing) {
                return state;
            }
            return {
                editing: undefined,
                registrations: [...state.registrations, {...state.editing, id: state.editing.id ? state.editing.id : (state.registrations.length + 1).toString()}]
            };

        case "DELETE_REGISTRATION":
            return {
                editing: undefined,
                registrations: state.registrations.filter(x => x.id === action.id)
            }
        
        case "EDIT_REGISTRATION_FIELD":
            return {
                ...state,
                editing: action.registration
            }

        case "SUBMIT_REGISTRATION":
            if (!state.editing) {
                return state;
            }
            return {
                registrations: [...state.registrations, state.editing],
                editing: undefined
            }

        default:
            return state;
    }
}