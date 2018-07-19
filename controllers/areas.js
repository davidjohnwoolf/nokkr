const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const Area = require('../models/area');
const Account = require('../models/account');

//status variables for Jsend API spec, password regex and role constants
const { SUCCESS, FAIL, ERROR, PW_REGEX, USER, MANAGER, ADMIN, SU } = require('../lib/constants');

const { requireAdmin, requireManager, requireUser, excludeReadOnly } = require('./helpers/authorization');

//body parser middleware
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//index
router.get('/', requireUser, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    let userQuery = {};
    
    if (loggedInUser.role === USER) userQuery = { _id: loggedInUser.id };
    if (loggedInUser.role === MANAGER) userQuery = { team: loggedInUser.team };
    
    User.find(userQuery, (err, users) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding users' });
        
        Account.findOne({}, (err, account) => {
            if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
            
            let areas = [];

            users.forEach(user => {
        
                const updatedAreas = user.areas.map(area => {
                    
                    let areaGroup = account.areaGroups.find(group => group.id == area.areaGroup);
                    let areaTeam = account.teams.find(team => team.id == user.team);

                    const newArea = Object.assign({
                        assignedUserName: user.firstName + ' ' + user.lastName,
                        groupTitle: areaGroup.title,
                        groupId: areaGroup.id,
                        teamTitle: areaTeam ? areaTeam.title : '-'
                    }, area._doc);
                    
                    return newArea;
                });
                
                areas = areas.concat(updatedAreas);
            });
            
            return res.json({ status: SUCCESS, data: { payload: areas } });
            
        });
    });
    
});

//create
router.post('/', requireManager, excludeReadOnly, (req, res) => {

    User.findOne({ _id: req.body.userId }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding user' });
        
        delete req.body.userId;

        user.areas.push(new Area(req.body));
        
        user.save((err, user) => {
            if (err) {
                return res.json({
                    status: ERROR,
                    data: err,
                    message: err.message || 'Error creating area'
                });
            }
            
            return res.json({
                status: SUCCESS,
                data: {
                    message: 'Area created',
                    payload: user.areas.find(area => area.title === req.body.title).id
                }
            });
        });
    });
});

//show
router.get('/:id', requireUser, (req, res) => {
    const loggedInUser = req.loggedInUser;

    User.find({}, (err, users) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        let area;
        let user;
        
        users.forEach(currentUser => {
            let currentArea = user.areas.find(area => area.id === req.params.areaId);
            if (currentArea) {
                area = currentArea;
                user = currentUser;
            }
        });
        
        if (!area) return res.json({ status: ERROR, data: err, code: 404, message: 'Area not found' });
        
        //manager and not own team or user and not own area
        if ((loggedInUser.role === MANAGER && (user.team != loggedInUser.team)) || (loggedInUser.role === USER && (loggedInUser.id != user.id))) {
            return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
        }
        
        return res.json({ status: SUCCESS, data: { payload: area } });
    });

});

//update
router.put('/:id', requireUser, excludeReadOnly, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    User.find({}, (err, users) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        let areaIndex;
        let user;
        
        users.forEach(currentUser => {
            let currentAreaIndex = user.areas.findIndex(area => area.id === req.params.areaId)
            if (currentAreaIndex) {
                areaIndex = currentAreaIndex;
                user = currentUser;
            }
        });
        
        if (!areaIndex) return res.json({ status: ERROR, data: err, code: 404, message: 'Area not found' });
        
        //manager and not own team or user and not own area
        if ((loggedInUser.role === MANAGER && (user.team != loggedInUser.team)) || (loggedInUser.role === USER && (loggedInUser.id != user.id))) {
            return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
        }
        
        for (let key in req.body) {
        	user[areaIndex][key] = req.body[key];
        }
        
        user.save((err, user) => {
            if (err) {
                return res.json({
                    status: ERROR,
                    data: err,
                    message: err.message || 'Error creating area'
                });
            }
            
            return res.json({ status: SUCCESS, data: { message: 'Area updated' } });
        });
    });
});


//destroy
router.delete('/:id', requireAdmin, excludeReadOnly, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    User.find({}, (err, users) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        let areaIndex;
        let user;
        
        users.forEach(currentUser => {
            let currentAreaIndex = user.areas.findIndex(area => area.id === req.params.areaId)
            if (currentAreaIndex) {
                areaIndex = currentAreaIndex;
                user = currentUser;
            }
        });
        
        if (!areaIndex) return res.json({ status: ERROR, data: err, code: 404, message: 'Area not found' });
        
        //manager and not own team or user and not own area
        if ((loggedInUser.role === MANAGER && (user.team != loggedInUser.team)) || (loggedInUser.role === USER && (loggedInUser.id != user.id))) {
            return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
        }
        
        user.areas[areaIndex].remove();
        
        return res.json({ status: SUCCESS, data: { message: 'User deleted' } });
        
    });
});

module.exports = router;