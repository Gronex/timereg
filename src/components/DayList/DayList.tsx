import React from 'react';
import { connect } from 'react-redux';
import { Registration } from '../../redux/store/registration/types';
import { addRegistration } from '../../redux/store/registration/actions';
import { RootState } from '../../redux/store';
import List, {Item} from '../List/List';
import { match, RouteComponentProps, useParams, withRouter } from 'react-router';

interface Params {
    date: string;
}

interface DispatchProps {
    registrations: Registration[];
    date : Date;
}

interface OwnProps extends RouteComponentProps<Params> {
}

const DayList: React.FC<DispatchProps> = (props) => {
    const { registrations, date } = props;

    const regs: Item[] = registrations.map(registration => {
        return {
            text: registration.description ?? registration.project ?? registration.id?.toString() ?? "",
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

const mapStateToProps = (state: RootState, ownProps : OwnProps) => {
    const timeStamp = Number.parseInt(ownProps.match.params.date);
    return {
        registrations: state.timeRegistration.registrations.filter(x => x.dateStamp == timeStamp),
        date: new Date(timeStamp)
    };
}

const mapDispatch = {
    addRegistration
}

export default withRouter(connect(mapStateToProps, mapDispatch)(DayList));