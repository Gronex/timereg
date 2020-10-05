import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Registration, RegistrationState } from '../redux/store/registration/types';
import { addRegistration } from '../redux/store/registration/actions';
import { RootState } from '../redux/store';

interface DispatchProps {
    addRegistration: (registration : Registration) => void;
    registrations: Registration[];
}

const Overview: React.FC<DispatchProps> = props => {
    const {addRegistration, registrations} = props;

    const handleAdd = () => {
        addRegistration({
            id: "1",
            date: new Date(),
            description: "",
            project: "",
            time: 1
        });
    }

    return (
        <div>
            <h1>Registrations:</h1>
            {registrations.map(r => <p>{r.date.toString()}</p>)}
            <button onClick={handleAdd}>Add</button>
        </div>
    )
}

const mapState = (state: RootState) => ({
    registrations: state.timeRegistration.registrations
});

const mapDispatch = {
    addRegistration
}

export default connect(mapState, mapDispatch)(Overview);