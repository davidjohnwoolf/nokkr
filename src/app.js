//import css for webpack
require('../sass/base.sass');

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navigation from './components/navigation';
import Dashboard from './components/dashboard';

ReactDOM.render(
    <Router>
        <div>
            <header className="site-header">
                <Navigation />
            </header>
            <Switch>
                <Route path="/" component={ Dashboard } />
        		<Route path="/area" component={ Dashboard } />
        		<Route path="/lead" component={ Dashboard } />
        		<Route path="/appointment" component={ Dashboard } />
    		</Switch>
        </div>
    </Router>,
    document.querySelector('#app')
);