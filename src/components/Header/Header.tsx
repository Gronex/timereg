import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../redux/store';

interface DispatchProps {
    version: string;
}
const logo = new URL('../../public/logo.png', import.meta.url).href;

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
                                    <p className="text-white text-2xl font-semibold inline-block align-middle p-4">Timereg</p>
                                </Link>
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