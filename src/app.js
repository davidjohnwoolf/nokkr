//import css for webpack
require('../sass/base.sass');

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';
import FlashMessage from './components/helpers/flash-messages';
import UserNew from './components/users/user-new';
import UserShow from './components/users/user-show';
import UserIndex from './components/users/user-index';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

ReactDOM.render(
    <Provider store={ createStoreWithMiddleware(reducers) }>
        <div>
            <FlashMessage />
            <Router>
                <div>
                    <Switch>
                        <Route path="/users/new" component={ UserNew } />
                        <Route path="/users/:id" component={ UserShow } />
                		<Route path="/users" component={ UserIndex } />
            		</Switch>
                </div>
            </Router>
        </div>
    </Provider>,
    document.querySelector('#app')
);