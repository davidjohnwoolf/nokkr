//import css for webpack
require('../sass/base.sass');

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import setAuthToken from './middleware/set-auth-token';

import reducers from './reducers';

import Navigation from './components/layout/navigation';
import Login from './components/authentication/login';
import UserIndex from './components/users/user-index';
import UserShow from './components/users/user-show';
import UserNew from './components/users/user-new';
import UserEdit from './components/users/user-edit';

const createStoreWithMiddleware = applyMiddleware(promise, setAuthToken)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <Router>
            <div>
                <header className="site-header">
                    <Navigation />
                </header>
                <Switch>
            		<Route path="/login" component={ Login } />
            		<Route path="/user/new" component={ UserNew } />
            		<Route path="/user/:id/edit" component={ UserEdit } />
            		<Route path="/user/:id" component={ UserShow } />
            		<Route path="/user" component={ UserIndex } />
        		</Switch>
            </div>
        </Router>
    </Provider>,
    document.querySelector('#app')
);