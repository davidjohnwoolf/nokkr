// load environment variables
require('dotenv').config();

const config = require('./config');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const app = express();
const mongoose = require('mongoose');

const Users = require('./controllers/users');

// connect database from MongoDB Atlas
mongoose.connect(`mongodb://admin:${encodeURI(process.env.DB_PASSWORD)}@ds221148.mlab.com:21148/platform2k`);

// get default connection
const db = mongoose.connection;

db.once('open', () => console.log('MongoDB running...'));

// bind connection to error event
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// middleware
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'dist')));

// routes
app.use('/user', Users);

// start server
app.listen(process.env.PORT || 8080, () => {
    console.log(`listening on port ${process.env.PORT || 8080}...`);
});