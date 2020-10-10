import { SystemState } from './types';
import { version } from '../../../../package.json';

const initialState : SystemState = {
    version
}

export function systemReducer(state = initialState) : SystemState {
    return state;
}