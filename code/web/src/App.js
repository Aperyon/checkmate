import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './styles/styles.css';

import CheckListList from './CheckListList/CheckListList';
import CheckListView from './CheckList/CheckListView';
import CheckListRun from './CheckList/CheckListRun';
import CheckListFormView from './CheckList/CheckListFormView';

import { Provider as CheckListsProvider } from './contexts/CheckListsContext';
import { Provider as CheckListRunProvider } from './contexts/CheckListRunContext';

export default function App() {
  return (
    <CheckListsProvider>
      <CheckListRunProvider>
        <Router>
          <Switch>
            <Route exact={true} path="/checklists/">
              <CheckListList />
            </Route>
            <Route exact path="/checklists/new/">
              <CheckListFormView />
            </Route>
            <Route exact path="/checklists/:id/">
              <CheckListFormView />
            </Route>
            <Route path="/checklist-runs/:id/">
              <CheckListRun runMode={true} />
            </Route>
          </Switch>
        </Router>
      </CheckListRunProvider>
    </CheckListsProvider>
  );
}
