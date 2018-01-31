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
const Users = require('./controllers/users');

// connect database
mongoose.connect(process.env.DB, () => console.log('database running...'));

// get default connection
const db = mongoose.connection;

// bind connection to error event
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// middleware
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'dist')));

// routes
app.use('/user', Users);

// start server
app.listen(process.env.PORT || 8080, () => console.log('server listening...'));

module.exports = app;