import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

interface IUrlParams {
    date: string
}

interface IDayListProps extends RouteComponentProps<IUrlParams>{

}

class DayList extends React.Component<IDayListProps> {
    
    private date : Date;

    constructor(props : IDayListProps) {
        super(props);
        this.date = new Date(props.match.params.date);
    }

    render() {
        return <h1>{this.date.toString()}</h1>
    }
}


export default withRouter(DayList);