import React, { ChangeEvent, FormEvent, useEffect } from 'react';
import { connect } from 'react-redux';
import { Registration } from '../../redux/store/registration/types';
import { editRegistration, addRegistration, removeRegistration } from '../../redux/store/registration/actions';
import { RootState } from '../../redux/store';
import { RouteComponentProps, withRouter } from 'react-router';
import { useHistory } from "react-router-dom";
import { renderHeadline } from '../Helpers';
import { DateTime } from 'luxon';
import { getRegistrations } from '../../redux/store/registration/reducers';

interface DispatchProps {
    registration: Registration;
    edit: boolean;
    addRegistration: (registration : Registration) => void;
    editRegistration: (id : number, registration : Registration) => void;
    removeRegistration: (id: number) => void;
}

interface Params {
    id?: string
}

interface OwnProps extends RouteComponentProps<Params>{
    
}

const EditRegistration: React.FC<DispatchProps> = (props) => {
    const {editRegistration, addRegistration, removeRegistration, edit } = props;
    const [reg, updateRegistration] = React.useState<Registration>(props.registration);
    const history = useHistory();
    const headline = edit ? `Edit ${reg.description}` : "New Registration";

    const handleInputChange = (event : ChangeEvent<HTMLInputElement>) => {
        switch(event.target.name){
            case "date":
                if(event.target.valueAsNumber) {
                    updateRegistration({
                        ...reg,
                        dateStamp: event.target.valueAsNumber
                    });
                }
                break;
            case "project":
                updateRegistration({
                    ...reg,
                    project: event.target.value
                });
                break;
            case "description":
                updateRegistration({
                    ...reg,
                    description: event.target.value
                });
                break;
            case "time":
                updateRegistration({
                    ...reg,
                    time: event.target.valueAsNumber
                });
                break;

            default:
                console.warn('unknown field', event);
        }
    }

    const sendForm = (event : FormEvent<Element>) => {
        event.preventDefault();
        edit 
            ? editRegistration(reg.id!, reg)
            : addRegistration(reg);
        history.push('/');
    }

    const deleteRegistration = () => {
        if(reg.id){
            removeRegistration(reg.id);
            history.push('/');
        }
    }

    const formatDate = (date : number) => {
        const dateTime = DateTime.fromMillis(date);
        return dateTime.toISODate();
    }

    return (
        <div className="pt-4 px-2">
            {renderHeadline(headline)}

            <div className="bg-gray-800 rounded-lg">
                <form className="mx-8 my-6 py-6" onSubmit={sendForm}>
                    <div className="mb-5">
                        <label className="block uppercase tracking-wide text-sm mb-2" htmlFor="date">Date</label>
                        <input 
                            name="date"
                            id="date"
                            type="date"
                            value={formatDate(reg.dateStamp)}
                            onChange={handleInputChange}
                            className="shadow bg-gray-800 border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"/>
                    </div>
                    <div className="mb-5">
                        <label className="block uppercase tracking-wide text-sm mb-2" htmlFor="project">Project</label>
                        <input 
                            name="project"
                            id="project"
                            type="text"
                            value={reg.project}
                            onChange={handleInputChange}
                            className="shadow bg-gray-800 border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-5">
                        <label className="block uppercase tracking-wide text-sm mb-2" htmlFor="description">Description</label>
                        <input
                            name="description"
                            id="description"
                            type="text"
                            value={reg.description}
                            onChange={handleInputChange}
                            className="shadow bg-gray-800 border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-5">
                        <label className="block uppercase tracking-wide text-sm mb-2" htmlFor="time">Time</label>
                        <input
                            name="time"
                            id="time"
                            type="number"
                            value={reg.time}
                            onChange={handleInputChange}
                            className="shadow bg-gray-800 border-gray-600 border appearance-none rounded w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>

                    <div className="grid grid-cols-6 gap-4 mt-2">
                        <button 
                            className="lg:col-start-2 lg:col-span-2 col-span-3 shadow bg-green-700 hover:bg-green-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                            type="submit"
                            onSubmit={sendForm}>Save</button>
                        {edit 
                            ? <button
                                className="lg:col-end-6 lg:col-span-2 col-span-3 shadow bg-red-700 hover:bg-red-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                                type="button"
                                onClick={deleteRegistration}>Delete</button>
                            : null}
                    </div>
                </form>
            </div>
        </div>
    )
}

const mapState = (state: RootState, ownProps : OwnProps) => {
    const id = ownProps.match.params.id ? Number.parseInt(ownProps.match.params.id) : undefined;
    const date = new URLSearchParams(ownProps.location.search).get('date');
    return {
        registration: getRegistrations(state).find(x => x.id === id) 
            ?? {
                dateStamp: date ? DateTime.fromISO(date).toMillis() : Date.now(),
                time: 0
            },
        edit: id !== undefined
    };
}

const mapDispatch = {
    editRegistration,
    addRegistration,
    removeRegistration
}

export default withRouter(connect(mapState, mapDispatch)(EditRegistration));