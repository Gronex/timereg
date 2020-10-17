import React from 'react';
import { connect } from 'react-redux';
import { Registration, RegistrationState } from '../redux/store/registration/types';
import { addRegistration } from '../redux/store/registration/actions';
import { RootState } from '../redux/store';
import List, {Item} from '../List/List';
import { match, withRouter } from 'react-router';

interface DispatchProps {
    registrations: Registration[];
    date : Date;
}

interface OwnProps {
    date?: Date
}

const DayList: React.FC<DispatchProps> = (props) => {
    const { registrations, date } = props;

    const regs: Item[] = registrations.map(registration => {
        return {
            text: registration.description,
            to: `/edit/${registration.id}`,
            id: registration.id
        };
    });
    
    console.log(regs.length);
    return (
        <div>
            <h1>{date.toDateString()}</h1>
            <List items={regs} />
        </div>
    )
}

const mapState = (state: RootState, ownProps : OwnProps) => ({
    registrations: state.timeRegistration.registrations,
    date: ownProps.date ?? new Date()
});

const mapDispatch = {
    addRegistration
}

export default withRouter(connect(mapState, mapDispatch)(DayList));