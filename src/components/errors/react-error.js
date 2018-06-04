import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const ReactError = (props) => (
    <main id="react-error" className="content">
        <section className="error-page">
            <div className="huge-center-icon warning">
                <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h2 className="text-center">Sorry, something went wrong!</h2>
            <p className="text-center">Please try again or contact <a href="">support</a>.</p>
        </section>
    </main>
);

export default ReactError;