const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Area = require('../models/area');

const verifyToken = require('./helpers/authorization');

//status variables for Jsend API spec
const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//index
router.get('/', (req, res) => {
    res.json({ message: 'working'})
});

module.exports = router;