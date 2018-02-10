//import css for webpack
require('../sass/base.sass');

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';

import reducers from './reducers/users.js';

import Navigation from './components/layout/navigation';
import Placeholder from './components/placeholder';
import UserShow from './components/users/user-show';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <Router>
            <div>
                <header className="site-header">
                    <Navigation />
                </header>
                <Switch>
                    <Route exact path="/" component={ Placeholder } />
            		<Route path="/area" component={ Placeholder } />
            		<Route path="/lead" component={ Placeholder } />
            		<Route path="/appointment" component={ Placeholder } />
            		<Route path="/user/:id" component={ UserShow } />
        		</Switch>
            </div>
        </Router>
    </Provider>,
    document.querySelector('#app')
);