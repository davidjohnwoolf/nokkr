// load environment variables from .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 8080;

const Users = require('./controllers/users');

// connect database from MongoDB Atlas
mongoose.connect(`mongodb+srv://platform2kadmin:${process.env.DB_PASSWORD}@platform2k-2kpxf.mongodb.net/test`);

// get default connection
const db = mongoose.connection;

// bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// static files
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/user', Users);

app.listen(8080, () => console.log(`listening on port ${port}...`));