//load environment variables
require('dotenv').config();

const express = require('express');
const path = require('path');
const logger = require('morgan');
const app = express();
const mongoose = require('mongoose');

const Authentication = require('./controllers/authentication');
const Accounts = require('./controllers/accounts');
const LeadStatuses = require('./controllers/lead-statuses');
const LeadFields = require('./controllers/lead-fields');
const AreaGroups = require('./controllers/area-groups');
const Teams = require('./controllers/teams');
const Users = require('./controllers/users');
const Areas = require('./controllers/areas');
const Leads = require('./controllers/leads');

const { ACCOUNT_PATH, TEAM_PATH, USER_PATH, FIELD_PATH, LEAD_STATUS_PATH, AREA_PATH, AREA_GROUP_PATH, LEAD_PATH } = require('./lib/constants');

//connect database
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.DB, () => console.log('database running...'));
} else {
    mongoose.connect(process.env.DB_TEST);
}

//get default connection
const db = mongoose.connection;

//bind connection to error event
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//middleware
if (process.env.NODE_ENV !== 'test') app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'dist')));

//routes
app.use('/', Authentication);
app.use(ACCOUNT_PATH, Accounts);
app.use(LEAD_STATUS_PATH, LeadStatuses);
app.use(FIELD_PATH, LeadFields);
app.use(AREA_GROUP_PATH, AreaGroups);
app.use(TEAM_PATH, Teams);
app.use(USER_PATH, Users);
app.use(AREA_PATH, Areas);
app.use(LEAD_PATH, Leads);

//start server
app.listen(process.env.PORT || 8080, () => console.log('server listening...'));

module.exports = app;