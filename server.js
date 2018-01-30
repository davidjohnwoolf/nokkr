const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(8080, function() {
    console.log(`listening on port ${port}...`);
});