//import css for webpack
require('../sass/base.sass');

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navigation from './components/navigation';
import Dashboard from './components/dashboard';

ReactDOM.render(
    <div>
        <header className="site-header">
            <Navigation />
        </header>
        <Router>
            <Switch>
                <Route path="/" component={ Dashboard } />
        		<Route path="/area" component={ Dashboard } />
        		<Route path="/lead" component={ Dashboard } />
        		<Route path="/appointment" component={ Dashboard } />
    		</Switch>
		</Router>
    </div>,
    document.querySelector('#app')
);