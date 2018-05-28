//import css for webpack
require('../sass/base.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import authorization from './helpers/authorization';
import reducers from './reducers';
import FlashMessage from './components/helpers/flash-messages';
import UserNew from './components/users/user-new';
import UserEdit from './components/users/user-edit';
import UserShow from './components/users/user-show';
import UserIndex from './components/users/user-index';
import Login from './components/authentication/login';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(reducers);

//make this middleware?
authorization(sessionStorage.getItem('p2k_token'), store);

ReactDOM.render(
    <Provider store={ store }>
        <div>
            <FlashMessage />
            <Router>
                <div>
                    <Switch>
                        <Route path="/users/new" component={ UserNew } />
                        <Route path="/users/:id/edit" component={ UserEdit } />
                        <Route path="/users/:id" component={ UserShow } />
                		<Route path="/users" component={ UserIndex } />
                		<Route path="/login" component={ Login } />
            		</Switch>
                </div>
            </Router>
        </div>
    </Provider>,
    document.querySelector('#app')
);