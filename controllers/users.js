const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
    res.send('user');
});

module.exports = router;