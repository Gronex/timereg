import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Registration } from '../../redux/store/registration/types';
import { RootState } from '../../redux/store';
import List, {createTimeListing, Item, Listing, renderListing} from '../List/List';
import { DateTime } from 'luxon';
import { groupBy } from '../../models/ListHelpers';

interface OverviewRegistration extends Registration {
    date: Date;
}

interface DispatchProps {
    registrations: OverviewRegistration[];
}
type Grouping = 'week' | 'month';
type Day = {hours: number, count: number, date: DateTime};

const Overview: React.FC<DispatchProps> = props => {
    const {registrations} = props;

    const [group, setGroup] = useState<Grouping>('week');

    const days = new Map<string, Day>();
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

    const getCountListing = (count : number) : Listing => {
        return { iconPath: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14", text: count.toString(), ariaLabel: "Count", stroke: "currentColor"}
    }

    const daysToItem = (days : Day[]) => {
        const dayItems: Item[] = [];
        Array.from(days.values()).sort((x, y) => -x.date.diff(y.date, 'day').days)
            .forEach(({date, hours, count}) => {
                dayItems.push({
                    title: `${date.toLocaleString()}`,
                    to: date.toISODate(),
                    id: date.toMillis(),
                    listings: [
                        createTimeListing(hours),
                        getCountListing(count)
                    ]
                });
            });
        return dayItems;
    }

    const renderList = ({key, values}: {key : number, values: Day[]}) => {
        const date = values[0].date;
        let headerText = date.monthLong;
        switch(group){
            case 'month':
                headerText = date.monthLong;
                break;
            case 'week':
                headerText = `Week ${date.weekNumber}`
                break;
        }

        const listings = [
            createTimeListing(values.reduce((tally, curent) => tally + curent.hours, 0)),
            getCountListing(values.reduce((tally, curent) => tally + curent.count, 0))
        ];

        return (
        <div key={key.toString()}>
            <div className="flex flex-col mt-2 -mb-2">
                <div className="flex flex-row mt-2">
                    <div className="flex w-full items-center justify-between px-8 py-6 bg-indigo-900">
                        <div className="flex flex-col ml-6">
                            <h3 className="text-lg font-bold text-teal-500">{headerText}</h3>
                            <div className="mt-4 flex">
                                {listings.map(renderListing)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <List items={daysToItem(values)} />
        </div>)
    }

    const handleGroupChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        switch(event.target.value) {
            case 'week':
            case 'month':
                setGroup(event.target.value);
                break;
            default:
                throw new Error(`invalid grouping: ${event.target.value}`);
        }
    }

    let groupPredicate;
    switch(group) {
        case 'month':
            groupPredicate = (x : {date: DateTime}) => DateTime.fromObject({year: x.date.year, month: x.date.month, day: 1}).toMillis();
            break;
        case 'week':
        default:
            groupPredicate = (x : {date: DateTime}) => x.date.minus({days: x.date.weekday - 1}).toMillis();
            break;
    }

    const groupedDays = groupBy(Array.from(days.values()), groupPredicate);

    return (
        <div>
            <div className="ml-4">
                <h3 className="text-xl">Grouping</h3>
                <div className="mt-2">
                    <label htmlFor="week" className="inline-flex items-center">
                        <input className="form-radio" id="week" name="group" type="radio" value="week" checked={group === 'week'} onChange={handleGroupChange}/>
                        <span className="ml-2">Week</span>
                    </label>
                    <label htmlFor="month" className="inline-flex items-center ml-6">
                        <input className="form-radio" id="month" name="group" type="radio" value="month" checked={group === 'month'} onChange={handleGroupChange} />
                        <span className="ml-2">Month</span>
                    </label>
                </div>
            </div>
            {groupedDays.map(x => renderList(x))}
        </div>
    )
}

const mapState = (state: RootState) => ({
    registrations: state.timeRegistration.registrations.map(x => {
        return {...x, date: new Date(x.dateStamp)}
    })
});

export default connect(mapState)(Overview);