const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Team = require('../models/team');

//const verifyToken = require('./helpers/authorization');

//status variables for Jsend API spec
const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

// body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//list
router.get('/:id', (req, res) => {
    Team.findOne({ _id: req.params.id }, (err, team) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding team' });
        
        if (!team) return res.json({ status: ERROR, data: err, code: 404, message: 'Team not found' });
        
        return res.json({ status: SUCCESS, data: { team } });
    });
});

//create
router.post('/', (req, res) => {
    Team.findOne({ _id: req.params.id }, (err, team) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error creating team' });
        
        if (team) return res.json({ status: FAIL, data: { message: 'Team already exists' } });

        const newTeam = new Team(req.body);
                
        newTeam.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error saving team' });
            
            return res.json({ status: SUCCESS, data: { message: 'Team created' } });
        });
        
    });
});

//show
router.get('/:id', (req, res) => {
    Team.findOne({ _id: req.params.id }, (err, team) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding team' });
        
        if (!team) return res.json({ status: ERROR, data: err, code: 404, message: 'Team not found' });
        
        return res.json({ status: SUCCESS, data: { team } });
    });
});

//update
router.put('/:id', (req, res) => {
    Team.findOne({ _id: req.params.id }, (err, team) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding team' });
        
        for (let key in req.body) {
        	team[key] = req.body[key];
        }
        
        team.save(err => {
            if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error updating team' });
            
            return res.json({ status: SUCCESS, data: { message: 'Team updated' } });
        });
    });
});

// destroy
router.delete('/:id', (req, res) => {
    Team.remove({ _id: req.params.id }, (err, team) => {
    	if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error deleting team' });
    
    	return res.json({ status: SUCCESS, data: { message: 'Team deleted' } });
    });
});

module.exports = router;