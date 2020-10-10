import React from 'react';
import './App.css';

import Overview from './Overview/Overview';
import DayList from './DayList/DayList';
import Header from './Header/Header';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
      <Router>
        <Header />
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
