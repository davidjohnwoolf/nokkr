const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

const Users = require('./controllers/users');

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/user', Users);

app.listen(8080, function() {
    console.log(`listening on port ${port}...`);
});