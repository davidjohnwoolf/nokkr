// load environment variables
require('dotenv').config();

// dependencies
// const config = require('./config');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const app = express();
const mongoose = require('mongoose');

// controllers
const Authentication = require('./controllers/authentication');
const Users = require('./controllers/users');
const Areas = require('./controllers/areas');

// connect database
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.DB, () => console.log('database running...'));
} else {
    mongoose.connect(process.env.DB_TEST);
}

// get default connection
const db = mongoose.connection;

// bind connection to error event
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// middleware
if (process.env.NODE_ENV !== 'test') app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'dist')));

// routes
//app.use(expressJWT({ secret: process.env.JWT_SECRET }).unless({ path: ['/login'] }));

app.use('/areas', Areas);
app.use('/users', Users);
app.use('/', Authentication);

// start server
app.listen(process.env.PORT || 8080, () => console.log('server listening...'));

module.exports = app;