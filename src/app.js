//import css for webpack
require('../sass/base.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import jwtDecode from 'jwt-decode';

import { LOGIN_SUCCESS, CLEAR_AUTH } from './actions/auth.action';
import authorization from './middleware/authorization';
import reducers from './reducers';
import PrivateRoute from './components/helpers/private-route';
import Flash from './components/helpers/flash';
import ErrorBoundary from './components/helpers/error-boundary';
import NotAuthorized from './components/errors/not-authorized';
import PageNotFound from './components/errors/page-not-found';
import Dashboard from './components/dashboard';
import Header from './components/layout/header';
import Menu from './components/layout/menu';
import UserNew from './components/users/user-new';
import UserEdit from './components/users/user-edit';
import UserShow from './components/users/user-show';
import UserIndex from './components/users/user-index';
import AreaNew from './components/areas/area-new';
import AreasAll from './components/areas/areas-all';
import AreasUser from './components/areas/areas-user';
import Login from './components/auth/login';

//use react production build for production https://reactjs.org/docs/optimizing-performance.html#use-the-production-build

const createStoreWithMiddleware = applyMiddleware(thunk, authorization)(createStore);

//remove the devtools extensiom for production
const store = createStoreWithMiddleware(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const token = sessionStorage.getItem('token');
const authenticated = store.getState().auth.authenticated;

//set authentication state on load
if (token && !authenticated) {
	
	const decoded = jwtDecode(token);
	const currentTime = Date.now() / 1000;
	
	//check exp
	if (currentTime < decoded.exp) {
	    store.dispatch({
            type: LOGIN_SUCCESS,
            isSuperUser: decoded.isSuperUser,
            isAdmin: decoded.isAdmin,
            isManager: decoded.isManager,
            team: decoded.team,
            id: decoded.id
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
                    <Switch>
                        <Route exact path="/login" render={ () => (
                            <ErrorBoundary><Login /></ErrorBoundary>
                        )} />
                        <PrivateRoute exact path="/menu" permissions="user" component={ Menu } />
                        <PrivateRoute exact path="/users/new" permissions="manager" component={ UserNew } />
                        <PrivateRoute exact path="/users/:id/edit" permissions="user" component={ UserEdit } />
                        {/*<PrivateRoute exact path="/users/:id/areas" permissions="user" component={ AreasUser } />*/}
                        <PrivateRoute exact path="/users/:id" permissions="user" component={ UserShow } />
                		<PrivateRoute exact path="/users" permissions="manager" component={ UserIndex } />
                		{/*<PrivateRoute exact path="/areas/new" component={ AreaNew } />*/}
                		{/*<PrivateRoute exact path="/areas/" component={ AreasAll } />*/}
                		<PrivateRoute exact path="/" permissions="user" component={ Dashboard } />
                		<Route exact path="/not-authorized" component={ NotAuthorized } />
                		<Route component={ PageNotFound } />
            		</Switch>
                </div>
            </Router>
        </div>
    </Provider>,
    document.querySelector('#app')
);