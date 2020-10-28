import React from 'react';
import { connect } from 'react-redux';
import { Registration } from '../../redux/store/registration/types';
import { addRegistration } from '../../redux/store/registration/actions';
import { RootState } from '../../redux/store';
import List, {createTimeListing, Item} from '../List/List';
import { RouteComponentProps, withRouter } from 'react-router';
import { renderHeadline } from '../Helpers';
import { DateTime } from 'luxon';
import { getRegistrations } from '../../redux/store/registration/reducers';

interface Params {
    date: string;
}

interface DispatchProps {
    registrations: Registration[];
    date : DateTime;
}

interface OwnProps extends RouteComponentProps<Params> {
}

const DayList: React.FC<DispatchProps> = (props) => {
    const { registrations, date } = props;

    const regs: Item[] = registrations.map(registration => {
        return {
            title: registration.description ?? registration.project ?? registration.id?.toString() ?? "",
            poject: registration.project,
            to: `/edit/${registration.id}`,
            id: registration.id,
            time: registration.time,
            listings: [
                { text: registration.project ?? "", iconPath: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", ariaLabel: "Project"},
                createTimeListing(registration.time)
            ]
        };
    });

    return (
        <div>
            {renderHeadline(date.toLocaleString())}
            <List items={regs} />
        </div>
    )
}

const mapStateToProps = (state: RootState, ownProps : OwnProps) => {
    const date = DateTime.fromISO(ownProps.match.params.date);
    return {
        registrations: getRegistrations(state).filter(x => x.dateStamp === date.toMillis()),
        date: date
    };
}

const mapDispatch = {
    addRegistration
}

export default withRouter(connect(mapStateToProps, mapDispatch)(DayList));