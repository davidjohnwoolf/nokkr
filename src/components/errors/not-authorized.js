import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => (
    <main id="not-authorized" className="content">
        <section className="error-page">
            <h1>403 Not Authorized</h1>
            <Link to="/login">Login to continue ></Link>
        </section>
    </main>
);

export default NotAuthorized;