//import css for webpack
require('../sass/base.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import authorization from './middleware/authorization';
import reducers from './reducers';
import PrivateRoute from './components/helpers/private-route';
import FlashMessage from './components/helpers/flash-messages';
import NotAuthorized from './components/errors/not-authorized';
import PageNotFound from './components/errors/page-not-found';
import Dashboard from './components/dashboard';
import Header from './components/layout/header';
import Menu from './components/layout/menu';
import UserNew from './components/users/user-new';
import UserEdit from './components/users/user-edit';
import UserShow from './components/users/user-show';
import UserIndex from './components/users/user-index';
import Login from './components/authentication/login';

const createStoreWithMiddleware = applyMiddleware(thunk, authorization)(createStore);

const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
    <Provider store={ store }>
        <div>
            <FlashMessage />
            <Router>
                <div>
                    <Header />
                    <Switch>
                        <Route exact path="/login" component={ Login } />
                        <Route exact path="/not-authorized" component={ NotAuthorized } />
                        <PrivateRoute exact path="/menu" component={ Menu } />
                        <PrivateRoute exact path="/users/new" component={ UserNew } />
                        <PrivateRoute exact path="/users/:id/edit" component={ UserEdit } />
                        <PrivateRoute exact path="/users/:id" component={ UserShow } />
                		<PrivateRoute exact path="/users" component={ UserIndex } />
                		<PrivateRoute exact path="/" component={ Dashboard } />
                		<Route path="*" component={ PageNotFound } />
            		</Switch>
                </div>
            </Router>
        </div>
    </Provider>,
    document.querySelector('#app')
);