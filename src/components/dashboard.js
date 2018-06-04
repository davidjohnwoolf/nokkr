import config from '../../config';

import React from 'react';

const Dashboard = () => (
    <main id="page-not-found" className="content">
        <section className="dashboard">
            <h1>{ config.dealerName }</h1>
        </section>
    </main>
);

export default Dashboard;