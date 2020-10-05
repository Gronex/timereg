import React from 'react';
import logo from './logo.png';
import './App.scss';

import Overview from './Overview/Overview';
import DayList from './DayList/DayList';

import {
  BrowserRouter as Router,
  Switch,
  Route, Link
} from "react-router-dom";

function App() {
  return (
      <Router>
        <header>
          <nav className="navbar is-primary">
            <div className="container">
              <div className="navbar-brand">
                <Link className="navbar-item" to="/">
                  <img src={logo} alt="Timereg" />
                </Link>
              </div>
            </div>
          </nav>
        </header>
        <main>
          <div className="container is-max-desktop">
            <Switch>
              <Route path="/:date">
                <DayList />
              </Route>
              <Route path="/">
                <Overview />
              </Route>
            </Switch>
          </div>
        </main>
      </Router>
  );
}

export default App;
