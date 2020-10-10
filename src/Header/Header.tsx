import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';

interface DispatchProps {
    version: string;
}
const logo = new URL('../../public/logo.png', import.meta.url).href;

const Header: React.FC<DispatchProps> = props => {
    return (
        <div>
            <img src={logo} alt="Timereg" />
            <h1>{props.version}</h1>
        </div>
    )
}

const mapState = (state: RootState) => ({
    version: state.system.version
});

const mapDispatch = {
}

export default connect(mapState, mapDispatch)(Header);