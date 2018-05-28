//import css for webpack
require('../sass/base.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import authorization from './helpers/authorization';
import reducers from './reducers';
import PrivateRoute from './components/helpers/private-route';
import FlashMessage from './components/helpers/flash-messages';
import NotAuthorized from './components/errors/not-authorized';
import PageNotFound from './components/errors/page-not-found';
import Dashboard from './components/dashboard';
import UserNew from './components/users/user-new';
import UserEdit from './components/users/user-edit';
import UserShow from './components/users/user-show';
import UserIndex from './components/users/user-index';
import Login from './components/authentication/login';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(reducers);

//make this middleware? also, dont pass in store, map your props to state?
authorization(sessionStorage.getItem('p2k_token'), store);

ReactDOM.render(
    <Provider store={ store }>
        <div>
            <FlashMessage />
            <Router>
                <div>
                    <Switch>
                        <PrivateRoute path="/users/:id/edit" component={ UserEdit } />
                        <PrivateRoute path="/users/:id" component={ UserShow } />
                		<PrivateRoute path="/users" component={ UserIndex } />
                		<PrivateRoute exact path="/" component={ Dashboard } />
                		<Route path="/login" component={ Login } />
                        <Route path="/users/new" component={ UserNew } />
                        <Route path="/not-authorized" component={ NotAuthorized } />
                		<Route path="*" component={ PageNotFound } />
            		</Switch>
                </div>
            </Router>
        </div>
    </Provider>,
    document.querySelector('#app')
);