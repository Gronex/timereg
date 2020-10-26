import React from 'react';
import { connect } from 'react-redux';
import { Registration } from '../../redux/store/registration/types';
import { RootState } from '../../redux/store';
import List, {createTimeListing, Item} from '../List/List';

interface OverviewRegistration extends Registration {
    date: Date;
}

interface DispatchProps {
    registrations: OverviewRegistration[];
}

const Overview: React.FC<DispatchProps> = props => {
    const {registrations} = props;

    const days = new Map<number, {hours: number, count: number}>();
    registrations.forEach(registration => {
        const key = new Date(registration.dateStamp).setHours(0, 0, 0, 0);
        var day = days.get(key);
        if(day){
            day.hours += registration.time;
            day.count++;
        }
        else {
            days.set(key, {
                hours: registration.time,
                count: 1
            });
        }
    });

    const dayItems: Item[] = [];
    days.forEach((value, key) => {
        dayItems.push({
            title: `${new Date(key).toDateString()}`,
            to: key.toString(),
            id: key,
            listings: [
                createTimeListing(value.hours),
                { iconPath: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14", text: value.count.toString(), stroke: "currentColor"}
            ]
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