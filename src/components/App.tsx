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
import AddButton from './AddButton/AddButton';
import EditRegistration from './EditRegistration/EditRegistration';

function App() {
  return (
      <Router>
        <Header />
        <main>
          <div className="container mx-auto">
            <Switch>
              <Route path="/" exact >
                <Overview />
                <AddButton />
              </Route>
              <Route path="/edit/:id" >
                <EditRegistration />
                <AddButton />
              </Route>
              <Route path="/new" >
                <EditRegistration />
                <AddButton />
              </Route>
              <Route path="/:date">
                <DayList/>
                <AddButton />
              </Route>
            </Switch>
          </div>
        </main>
      </Router>
  );
}

export default App;
