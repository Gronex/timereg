import React, { ChangeEvent, FormEvent } from 'react';
import { connect } from 'react-redux';
import { Registration } from '../../redux/store/registration/types';
import { editRegistration, addRegistration } from '../../redux/store/registration/actions';
import { RootState } from '../../redux/store';
import { RouteComponentProps, withRouter } from 'react-router';
import { useHistory } from "react-router-dom";

interface DispatchProps {
    registration: Registration;
    edit: boolean;
    editRegistration: (registration : Registration) => void;
    addRegistration: () => void;
}

interface Params {
    id?: string
}

interface OwnProps extends RouteComponentProps<Params>{
    
}

const EditRegistration: React.FC<DispatchProps> = (props) => {
    const {editRegistration, addRegistration, registration, edit } = props;
    const history = useHistory();

    const renderHeader = () => {
        if(edit) {
            return (<h1>Edit {registration.description}</h1>);
        } else {
            return (<h1>New Registration</h1>);
        }
    }

    const handleInputChange = (event : ChangeEvent<HTMLInputElement>) => {
        switch(event.target.name){
            case "date":
                editRegistration({
                    ...registration,
                    dateStamp: event.target.valueAsNumber
                });
                break;
            case "project":
                editRegistration({
                    ...registration,
                    project: event.target.value
                });
                break;
            case "description":
                editRegistration({
                    ...registration,
                    description: event.target.value
                });
                break;
            case "time":
                editRegistration({
                    ...registration,
                    time: event.target.valueAsNumber
                });
                break;

            default:
                console.warn('unknown field', event);
        }

    }

    const sendForm = (event : FormEvent<Element>) => {
        event.preventDefault();
        
        addRegistration();
        history.push('/');
    }

    const deleteRegistration = () => {
        console.log("Delete", registration?.id);
    }

    return (
        <form onSubmit={sendForm}>
            {renderHeader()}
            <div>
                <label htmlFor="date">Date</label>
                <input name="date" id="date" type="date" value={registration.dateStamp} onChange={handleInputChange}/>
            </div>
            <div>
                <label htmlFor="project">Project</label>
                <input name="project" id="project" type="text" value={registration.project} onChange={handleInputChange} />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <input name="description" id="description" type="text" value={registration.description} onChange={handleInputChange} />
            </div>
            <div>
                <label htmlFor="time">Time</label>
                <input name="time" id="time" type="number" value={registration.time} onChange={handleInputChange} />
            </div>
            <button type="submit">Save</button>
            {edit ? <button onClick={deleteRegistration}>Delete</button> : null}
        </form>
    )
}

const mapState = (state: RootState, ownProps : OwnProps) => {
    const id = ownProps.match.params.id ? Number.parseInt(ownProps.match.params.id) : undefined;
    return {
        registration: (
            id ? state.timeRegistration.registrations.find(x => x.id === id)
            : state.timeRegistration.editing) ?? {
                dateStamp: Date.now(),
                time: 0
            },
        edit: id !== undefined
    };
}

const mapDispatch = {
    editRegistration,
    addRegistration
}

export default withRouter(connect(mapState, mapDispatch)(EditRegistration));