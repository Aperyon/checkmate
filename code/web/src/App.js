import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import './styles/styles.css';

import ChecklistList from './ChecklistList/ChecklistList';
import ChecklistRun from './Checklist/ChecklistRun';
import ChecklistFormView from './Checklist/ChecklistFormView';
import Login from './Auth/Login';
import Logout from './Auth/Logout';
import Signup from './Auth/Signup';
import SignupSuccess from './Auth/SignupSuccess';
import Nav from './Nav/Nav';

import { Provider as ChecklistsProvider } from './contexts/ChecklistsContext';
import { Provider as ChecklistRunProvider } from './contexts/ChecklistRunContext';
import { Provider as AuthProvider, Context as AuthContext } from './contexts/AuthContext';

export default function EntryPoint() {
  return (
    <ChecklistsProvider>
      <ChecklistRunProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ChecklistRunProvider>
    </ChecklistsProvider>
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
        <Route exact path="/signup-success/">
          <SignupSuccess />
        </Route>
        <Route exact path="/logout/">
          <Logout />
        </Route>
        <PrivateRoute exact path="/checklists/">
          <ChecklistList />
        </PrivateRoute>
        <PrivateRoute exact path="/checklists/new/">
          <ChecklistFormView />
        </PrivateRoute>
        <PrivateRoute exact path="/checklists/:id/">
          <ChecklistFormView />
        </PrivateRoute>
        <PrivateRoute exact path="/checklist-runs/:id/">
          <ChecklistRun runMode={true} />
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
