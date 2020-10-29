import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';

import logo from 'url:../../public/clock.png';

interface DispatchProps {
    version: string;
}

const Header: React.FC<DispatchProps> = props => {
    return (
        <div>
            <nav className="bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Link to="/">
                                    <img className="h-8 w-8 inline-block" src={logo} alt="Timereg" />
                                    <span className="text-green-500 text-2xl font-semibold inline-block align-middle p-4">Timereg</span>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <a href="https://github.com/Gronex/timereg/blob/master/CHANGELOG.md" target="_blank">
                                    <span className="text-lg align-middle">Version {props.version}</span>
                                </a>
                                <a href="https://github.com/Gronex/timereg/issues" target="_blank">
                                    <span aria-label="Github issues" className="pl-2 material-icons text-4xl inline-block align-middle">bug_report</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

const mapState = (state: RootState) => ({
    version: state.system.version
});

const mapDispatch = {
}

export default connect(mapState, mapDispatch)(Header);