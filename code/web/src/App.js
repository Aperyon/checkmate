import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import './styles/styles.css';

import CheckListList from './CheckListList/CheckListList';
import CheckListRun from './CheckList/CheckListRun';
import CheckListFormView from './CheckList/CheckListFormView';
import Login from './Auth/Login';
import Logout from './Auth/Logout';
import Signup from './Auth/Signup';
import Nav from './Nav/Nav';

import { Provider as CheckListsProvider } from './contexts/CheckListsContext';
import { Provider as CheckListRunProvider } from './contexts/CheckListRunContext';
import { Provider as AuthProvider, Context as AuthContext } from './contexts/AuthContext';

export default function EntryPoint() {
  return (
    <CheckListsProvider>
      <CheckListRunProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </CheckListRunProvider>
    </CheckListsProvider>
  );
}


function App() {
  const { localLoginUser } = React.useContext(AuthContext);

  React.useEffect(() => {
    localLoginUser()
  }, [])

  return (
    <Router>
      <Nav />
      <Switch>
        <Route exact path="/login/">
          <Login />
        </Route>
        <Route exact path="/signup/">
          <Signup />
        </Route>
        <Route exact path="/logout/">
          <Logout />
        </Route>
        <PrivateRoute exact path="/checklists/">
          <CheckListList />
        </PrivateRoute>
        <PrivateRoute exact path="/checklists/new/">
          <CheckListFormView />
        </PrivateRoute>
        <PrivateRoute exact path="/checklists/:id/">
          <CheckListFormView />
        </PrivateRoute>
        <PrivateRoute exact path="/checklist-runs/:id/">
          <CheckListRun runMode={true} />
        </PrivateRoute>
        <Route exact path="/">
          <Redirect to="/checklists/" />
        </Route>
      </Switch>
    </Router>
  )
}


function PrivateRoute({ children, ...rest }) {
  const { state: authState } = React.useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authState.isAuthenticated ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login/",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}
