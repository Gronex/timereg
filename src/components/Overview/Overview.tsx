import React from 'react';
import { connect } from 'react-redux';
import { Registration } from '../../redux/store/registration/types';
import { RootState } from '../../redux/store';
import List, {Item} from '../List/List';

interface OverviewRegistration extends Registration {
    date: Date;
}

interface DispatchProps {
    registrations: OverviewRegistration[];
}

const Overview: React.FC<DispatchProps> = props => {
    const {registrations} = props;

    const days = new Map<number, {hours: number}>();
    registrations.forEach(registration => {
        const key = new Date(registration.dateStamp).setHours(0, 0, 0, 0);
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
            to: key.toString(),
            id: key
        });
    })
    return (
        <div>
            <List items={dayItems} />
        </div>
    )
}

const mapState = (state: RootState) => ({
    registrations: state.timeRegistration.registrations.map(x => {
        return {...x, date: new Date(x.dateStamp)}
    })
});

export default connect(mapState)(Overview);