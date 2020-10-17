import { RootState } from '..';
import { Repository } from '../../../services/repository';
import { ADD_REGISTRATION, DELETE_REGISTRATION, EDIT_REGISTRATION_FIELD, Registration, SUBMIT_REGISTRATION } from './types';

export function addRegistration() {
    return async (dispatch : (event : any) => void, getState : () => RootState) => {
        const registration = getState().timeRegistration.editing;
        let newId = registration?.id;
        if(registration) {
            const repo = await Repository.getCurrent();
            newId = await repo.updateRegistration({
                date: new Date(registration.dateStamp),
                hours: registration.time,
                timeFrom: 0,
                timeTo: registration.time,
                description: registration.description,
                project: registration.project,
                id: registration.id
            });
        }
        return dispatch({
            type: ADD_REGISTRATION,
            id: newId
        });
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