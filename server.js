const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('working');
});

app.listen(8080, function() {
    console.log(`listening on port ${port}...`);
});