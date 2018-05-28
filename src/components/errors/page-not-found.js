import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => (
    <main id="page-not-found" className="content">
        <section className="error-page">
            <h1>404 Page Not Found</h1>
            <Link to="/">Back to home ></Link>
        </section>
    </main>
);

export default NotAuthorized;