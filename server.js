const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.listen(8080, function() {
    console.log(`listening on port ${port}...`);
});