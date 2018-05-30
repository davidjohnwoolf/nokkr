import config from '../../config';

import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => (
    <main id="page-not-found" className="content">
        <section className="dashboard">
            <h1>{ config.dealerName }</h1>
        </section>
    </main>
);

export default Dashboard;