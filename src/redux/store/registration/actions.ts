import { RootState } from '..';
import { TimeRegistration } from '../../../models/timeRegistration';
import { Repository } from '../../../services/repository';
import { ADD_REGISTRATION, DELETE_REGISTRATION, Registration, RegistrationActionTypes, UPDATE_REGISTRATION } from './types';

function mapRegistration(registration : Registration) : TimeRegistration {
    return {
        date: new Date(registration.dateStamp),
        hours: registration.time,
        timeFrom: 0,
        timeTo: registration.time,
        description: registration.description,
        project: registration.project
    }
}

export function addRegistration(registration: Registration) {
    return async (dispatch : (event : RegistrationActionTypes) => void) => {
        const repo = await Repository.getCurrent();
        
        const newId = await repo.updateRegistration(mapRegistration(registration));

        return dispatch({
            type: ADD_REGISTRATION,
            registration: {
                ...registration,
                id: newId
            }
        });
    }
}

export function removeRegistration(id: number) {
    return async (dispatch : (event : RegistrationActionTypes) => void) => {
        const repo = await Repository.getCurrent();
        await repo.remove(id);

        return dispatch({
            type: DELETE_REGISTRATION,
            id: id
        });
    }
}

export function editRegistration(id : number, registration : Registration) {

    return async (dispatch : (event : RegistrationActionTypes) => void) => {
        const repo = await Repository.getCurrent();
        const timeRegistration = mapRegistration(registration);
        timeRegistration.id = id;
        registration.id = await repo.updateRegistration(timeRegistration);
        registration.dateStamp = new Date(registration.dateStamp).setHours(0, 0, 0, 0);

        return dispatch({
            type: UPDATE_REGISTRATION,
            id: id,
            registration: registration
        });
    }
}
