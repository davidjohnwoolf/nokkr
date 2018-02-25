//import css for webpack
require('../sass/base.sass');

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';

import reducers from './reducers';

import Navigation from './components/layout/navigation';
import UserIndex from './components/users/user-index';
import UserShow from './components/users/user-show';
import UserNewForm from './components/users/user-new-form';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <Router>
            <div>
                <header className="site-header">
                    <Navigation />
                </header>
                <Switch>
            		<Route path="/user/new" component={ UserNewForm } />
            		<Route path="/user/:id" component={ UserShow } />
            		<Route path="/user" component={ UserIndex } />
        		</Switch>
            </div>
        </Router>
    </Provider>,
    document.querySelector('#app')
);