const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
//const Area = require('../models/area');

const verifyToken = require('./helpers/authorization');

//for specific user requests
const USER_PATH = '/users/:id';

//status variables for Jsend API spec
const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//index all
router.get('/areas', (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding users' });
        
        const allAreas = [];
        
        for (let user in users) {
            users[user].areas.forEach(c => {
                let area = c;
                
                c.userData = { name: users[user].name, id: users[user].id };
                
                allAreas.push(area);
            });
        }
        
        return res.json({ status: SUCCESS, data: { allAreas } });
    });
});

//index user
router.get(`${ USER_PATH }/areas`, (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        return res.json({ status: SUCCESS, data: { areas: user.areas } });
    });
});

//create
router.post('/areas', (req, res) => {
    User.findOne({ _id: req.body.userId }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        if (!user) {
            return res.json({ status: FAIL, data: { message: 'User either not selected or invalid' } });
        }
        
        if (user.areas.find(area => area.title = req.body.title)) {
            return res.json({ status: FAIL, data: { message: 'Area title already exists for this user' } });
        }
        
        delete req.body.userId;
        
        user.areas.push(req.body);
        
        user.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error saving user' });
            
            return res.json({ status: SUCCESS, data: { message: 'Area created' } });
        });
    });
});

//show
router.get(`${ USER_PATH }/areas/:areaId`, (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        const area = user.areas.find(area => area.id === req.params.areaId);
        
        if (!area) return res.json({ status: ERROR, data: err, code: 404, message: 'Area not found' });
        
        return res.json({ status: SUCCESS, data: { area } });
    });
});

//update
router.put(`${ USER_PATH }/areas/:areaId`, (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        const areaIndex = user.areas.findIndex(area => area.id === req.params.id);
        
        for (let key in req.body) {
        	user.areas[areaIndex][key] = req.body[key];
        }
        
        user.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error updating area' });
            
            return res.json({ status: SUCCESS, data: { message: 'Area updated' } });
        });
    });
});

// destroy
router.delete(`${ USER_PATH }/areas/:areaId`, verifyToken, (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
    	if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
    	
    	const areaIndex = user.areas.findIndex(area => area.id === req.params.id);
    	
    	user.areas[areaIndex].remove();
    	
    	user.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error deleting area' });
            
            return res.json({ status: SUCCESS, data: { message: 'Area deleted' } });
        });
    });
});

module.exports = router;