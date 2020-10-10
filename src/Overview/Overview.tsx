import React from 'react';
import { connect } from 'react-redux';
import { Registration, RegistrationState } from '../redux/store/registration/types';
import { addRegistration } from '../redux/store/registration/actions';
import { RootState } from '../redux/store';
import List, {Item} from '../List/List';

interface OverviewRegistration extends Registration {
    date: Date;
}

interface DispatchProps {
    addRegistration: (registration : Registration) => void;
    registrations: OverviewRegistration[];
}
let id = 1;

const Overview: React.FC<DispatchProps> = props => {
    const {addRegistration, registrations} = props;

    const handleAdd = () => {
        addRegistration({
            id: `${id++}`,
            dateStamp: Date.now(),
            description: "",
            project: "",
            time: 1
        });
    }

    const days = new Map<number, {hours: number}>();
    registrations.forEach(registration => {
        const key = new Date(registration.dateStamp).setUTCHours(0, 0, 0, 0);
        var day = days.get(key);
        if(day){
            day.hours += registration.time;
        }
        else {
            days.set(key, {
                hours: registration.time
            });
        }
    });

    const dayItems: Item[] = [];
    days.forEach((value, key) => {
        dayItems.push({
            text: `${new Date(key).toDateString()} - ${value.hours}`,
            to: key.toString()
        });
    })
    return (
        <div>
            <List items={dayItems} />
            <button onClick={handleAdd}>Add</button>
        </div>
    )
}

const mapState = (state: RootState) => ({
    registrations: state.timeRegistration.registrations.map(x => {
        return {...x, date: new Date(x.dateStamp)}
    })
});

const mapDispatch = {
    addRegistration
}

export default connect(mapState, mapDispatch)(Overview);