//import css for webpack
require('../sass/base.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import jwtDecode from 'jwt-decode';

import { LOGIN, CLEAR_AUTH } from './actions/auth.action';
import authorization from './middleware/authorization';
import reducers from './reducers';

import PrivateRoute from './components/app/private-route';
import Flash from './components/app/flash';
import ErrorBoundary from './components/app/error-boundary';

import NotAuthorized from './components/errors/not-authorized';
import PageNotFound from './components/errors/page-not-found';
import Dashboard from './components/dashboard';
import Header from './components/layout/header';
import Login from './components/auth/login';

import TeamNew from './components/teams/team-new';
import TeamEdit from './components/teams/team-edit';
import TeamShow from './components/teams/team-show';
import TeamIndex from './components/teams/team-index';

import UserNew from './components/users/user-new';
import UserEdit from './components/users/user-edit';
import UserShow from './components/users/user-show';
import UserIndex from './components/users/user-index';
import AreaNew from './components/areas/area-new';

import { SU, ADMIN, MANAGER, USER } from '../lib/constants';

//use react production build for production https://reactjs.org/docs/optimizing-performance.html#use-the-production-build

const createStoreWithMiddleware = applyMiddleware(authorization, thunk)(createStore);

//remove the devtools extensiom for production
const store = createStoreWithMiddleware(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const token = sessionStorage.getItem('token');
const authenticated = store.getState().auth.authenticated;

console.log('testing')

//set authentication state on load
if (token && !authenticated) {
	
	const decoded = jwtDecode(token);
	const currentTime = Date.now() / 1000;
	
	//check exp
	if (currentTime < decoded.exp) {
	    store.dispatch({
            type: LOGIN,
            role: decoded.role,
            isReadOnly: decoded.isReadOnly,
            sessionTeam: decoded.team,
            sessionId: decoded.id
        });

	} else {
		//remove storage and update state
	    sessionStorage.removeItem('token');
	    store.dispatch({ type: CLEAR_AUTH });
	}
	
} else if (!token && authenticated) {
    store.dispatch({ type: CLEAR_AUTH });
}

ReactDOM.render(
    <Provider store={ store }>
        <div>
            <Flash />
            <Router>
                <div>
                    <Header />
                    { /* add state for menu, on/off, and move menu to header */ }
                    <Switch>
                        <Route exact path="/login" render={ () => (
                            <ErrorBoundary><Login /></ErrorBoundary>
                        )} />
                        
                        <PrivateRoute exact path="/teams/new" access={ ADMIN } writeAccess="true" component={ TeamNew } />
                        <PrivateRoute exact path="/teams/:id/edit" access={ ADMIN } writeAccess="true" component={ TeamEdit } />
                        <PrivateRoute exact path="/teams/:id" access={ MANAGER } component={ TeamShow } />
                		<PrivateRoute exact path="/teams" access={ ADMIN } component={ TeamIndex } />
                		
                        <PrivateRoute exact path="/users/new" access={ ADMIN } writeAccess="true" component={ UserNew } />
                        <PrivateRoute exact path="/users/:id/edit" access={ ADMIN } writeAccess="true" component={ UserEdit } />
                        <PrivateRoute exact path="/users/:id" component={ UserShow } />
                		<PrivateRoute exact path="/users" access={ ADMIN } component={ UserIndex } />
                		
                		<PrivateRoute exact path="/areas/new" access={ MANAGER } writeAccess="true" component={ AreaNew } />
                        { /*<PrivateRoute exact path="/areas/:id/edit" access={ MANAGER } writeAccess="true" component={ AreaEdit } />
                        <PrivateRoute exact path="/areas/:id" component={ AreaShow } />
                		<PrivateRoute exact path="/areas" access={ MANAGER } component={ AreaIndex } /> */ }
                		
                		<PrivateRoute exact path="/" permission="user" component={ Dashboard } />
                		
                		<Route exact path="/not-authorized" render={ () => (
                            <ErrorBoundary><NotAuthorized /></ErrorBoundary>
                        )} />
                        <Route render={ () => (
                            <ErrorBoundary><PageNotFound /></ErrorBoundary>
                        )} />
            		</Switch>
                </div>
            </Router>
        </div>
    </Provider>,
    document.querySelector('#app')
);