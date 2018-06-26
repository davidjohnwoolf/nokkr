const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Account = require('../models/account');

//const verifyToken = require('./helpers/authorization');

//status variables for Jsend API spec
const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//show
router.get('/', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        if (!account) return res.json({ status: ERROR, data: err, code: 404, message: 'Account not found' });
        
        return res.json({ status: SUCCESS, data: { account } });
    });
});

//update
router.put('/', (req, res) => {
    Account.findOne({}, (err, account) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding account' });
        
        for (let key in req.body) {
        	account[key] = req.body[key];
        }
        
        account.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error updating account' });
            
            return res.json({ status: SUCCESS, data: { message: 'Account updated' } });
        });
    });
});

module.exports = router;