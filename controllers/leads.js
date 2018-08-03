const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/user');
const Lead = require('../models/lead');
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
            
            let leads = [];
        
            users.forEach(user => {
                let team = account.teams.find(team => team.id == user.teamId);
                
                let userLeads = user.leads.map(lead => {
                    return Object.create({
                        assignedUserName: user.firstName + ' ' + user.lastName,
                        userId: user._id,
                        teamTitle: team ? team.title : '-'
                    }, lead._doc);
                });
                
                leads = leads.concat(userLeads);
            });
            
            return res.json({ status: SUCCESS, data: { payload: leads } });
        });
    });
});

//create
router.post('/', requireManager, excludeReadOnly, (req, res) => {

    User.findOne({ _id: req.body.userId }, (err, user) => {
        if (err) return res.json({ status: ERROR, data: err, message: 'Error finding user' });
        
        delete req.body.userId;

        user.leads.push(new Lead(req.body));
        
        user.save((err, user) => {
            if (err) {
                return res.json({
                    status: ERROR,
                    data: err,
                    message: err.message || 'Error creating lead'
                });
            }
            
            return res.json({
                status: SUCCESS,
                data: {
                    message: 'Lead created',
                    payload: user.leads.find(lead => lead.address === req.body.address).id
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
        
        let lead;
        let user;
        
        users.forEach(currentUser => {
            let currentLead = user.leads.find(lead => lead.id === req.params.leadId);
            if (currentLead) {
                lead = currentLead;
                user = currentUser;
            }
        });
        
        if (!lead) return res.json({ status: ERROR, data: err, code: 404, message: 'Lead not found' });
        
        //manager and not own team or user and not own lead
        if ((loggedInUser.role === MANAGER && (user.team != loggedInUser.team)) || (loggedInUser.role === USER && (loggedInUser.id != user.id))) {
            return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
        }
        
        return res.json({ status: SUCCESS, data: { payload: lead } });
    });
});

//update
router.put('/:id', requireUser, excludeReadOnly, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    User.find({}, (err, users) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        let leadIndex;
        let user;
        
        users.forEach(currentUser => {
            let currentLeadIndex = user.leads.findIndex(lead => lead.id === req.params.leadId);
            if (currentLeadIndex) {
                leadIndex = currentLeadIndex;
                user = currentUser;
            }
        });
        
        if (!leadIndex) return res.json({ status: ERROR, data: err, code: 404, message: 'Lead not found' });
        
        //manager and not own team or user and not own lead
        if ((loggedInUser.role === MANAGER && (user.team != loggedInUser.team)) || (loggedInUser.role === USER && (loggedInUser.id != user.id))) {
            return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
        }
        
        for (let key in req.body) {
        	user.leads[leadIndex][key] = req.body[key];
        }
        
        user.save(err => {
            if (err) {
                return res.json({
                    status: ERROR,
                    data: err,
                    message: err.message || 'Error creating lead'
                });
            }
            
            return res.json({ status: SUCCESS, data: { message: 'Lead updated' } });
        });
    });
});


//destroy
router.delete('/:id', requireAdmin, excludeReadOnly, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    User.find({}, (err, users) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        let leadIndex;
        let user;
        
        users.forEach(currentUser => {
            let currentLeadIndex = user.leads.findIndex(lead => lead.id === req.params.leadId)
            if (currentLeadIndex) {
                leadIndex = currentLeadIndex;
                user = currentUser;
            }
        });
        
        if (!leadIndex) return res.json({ status: ERROR, data: err, code: 404, message: 'Lead not found' });
        
        //manager and not own team or user and not own lead
        if ((loggedInUser.role === MANAGER && (user.team != loggedInUser.team)) || (loggedInUser.role === USER && (loggedInUser.id != user.id))) {
            return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
        }
        
        user.leads[leadIndex].remove();
        
        return res.json({ status: SUCCESS, data: { message: 'Lead deleted' } });
        
    });
});

module.exports = router;