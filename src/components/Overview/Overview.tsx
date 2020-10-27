import React from 'react';
import { connect } from 'react-redux';
import { Registration } from '../../redux/store/registration/types';
import { RootState } from '../../redux/store';
import List, {createTimeListing, Item} from '../List/List';
import { DateTime } from 'luxon';

interface OverviewRegistration extends Registration {
    date: Date;
}

interface DispatchProps {
    registrations: OverviewRegistration[];
}

const Overview: React.FC<DispatchProps> = props => {
    const {registrations} = props;

    const days = new Map<string, {hours: number, count: number, date: DateTime}>();
    registrations.forEach(registration => {
        const date = DateTime.fromMillis(registration.dateStamp);
        const key = date.toISODate();
        var day = days.get(key);
        if(day){
            day.hours += registration.time;
            day.count++;
        }
        else {
            days.set(key, {
                hours: registration.time,
                count: 1,
                date: date
            });
        }
    });

    const dayItems: Item[] = [];
    Array.from(days.values()).sort((x, y) => -x.date.diff(y.date, 'day').days).forEach(({date, hours, count}) => {
        dayItems.push({
            title: `${date.toLocaleString()}`,
            to: date.toISODate(),
            id: date.toMillis(),
            listings: [
                createTimeListing(hours),
                { iconPath: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14", text: count.toString(), ariaLabel: "Count", stroke: "currentColor"}
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