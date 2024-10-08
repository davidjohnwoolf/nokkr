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
            let areas = [];
            
            users.forEach(user => areas = areas.concat(user.areas)); 
        
            users.forEach(user => {
                let team = account.teams.find(team => team.id == user.teamId);
                
                let userLeads = user.leads.map(lead => {
                    let leadStatus = account.leadStatuses.find(status => status.id == lead.leadStatusId);
                    let leadArea = areas.find(area => area.id == lead.areaId);
                    let areaGroup = account.areaGroups.find(areaGroup => areaGroup.id == leadArea.areaGroupId);
                    let createdByUser = users.find(user => user.id == lead.createdBy);
                    
                    return Object.assign({
                        assignedUserName: user.firstName + ' ' + user.lastName,
                        createdByName: createdByUser.firstName + ' ' + createdByUser.lastName,
                        userId: user._id,
                        teamTitle: team ? team.title : '-',
                        teamId: team ? team._id : '-',
                        leadStatusTitle: leadStatus.title,
                        leadStatusId: leadStatus._id,
                        leadStatusType: leadStatus.type,
                        leadStatusColor: leadStatus.color,
                        areaTitle: (leadArea ? leadArea.title : undefined),
                        areaGroupId: (areaGroup ? areaGroup.id : undefined),
                        areaGroupTitle: (areaGroup ? areaGroup.title : undefined)
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
            let currentLead = currentUser.leads.find(lead => lead.id === req.params.id);
            if (currentLead) {
                lead = Object.assign({ assignedUserName: currentUser.firstName + ' ' + currentUser.lastName }, currentLead._doc);
                user = currentUser;
            }
        });
        
        users.forEach(currentUser => {
            if (lead.createdBy == currentUser.id) lead.createdByUser = currentUser.firstName + ' ' + currentUser.lastName;
            currentUser.areas.forEach(area => {
                if (lead.areaId == area.id) lead.area = area.title;
            });
        });
        
        if (!lead) return res.json({ status: ERROR, data: err, code: 404, message: 'Lead not found' });
        
        Account.findOne({}, (err, account) => {
            if (err) return res.json({ status: ERROR, data: err, message: 'Error finding account' });
            
            lead.leadStatus = account.leadStatuses.find(status => status.id == lead.leadStatusId).title;
            
            //manager and not own team or user and not own lead
            if ((loggedInUser.role === MANAGER && (user.team != loggedInUser.team)) || (loggedInUser.role === USER && (loggedInUser.id != user.id))) {
                return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
            }
            
            return res.json({ status: SUCCESS, data: { payload: lead } });
        });
    });
});

//bulk status update
router.put('/bulk-update-status', requireAdmin, excludeReadOnly, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    /*User.find({}, (err, users) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        users.forEach(user => {
            let userUpdated = false;
            user.leads.forEach(lead => {
                req.body.leadIds.forEach(id => {
                    if (lead.id == id) {
                        lead.leadStatus = req.body.leadStatus;
                        userUpdated = true;
                })
            });
        });
    });*/
    
    //_id: { $in: req.body.leadIds }
    
    User.updateMany({ 'leads._id': { $in: req.body.leadIds } }, { $set: { 'leads.leadStatusId' : req.body.leadStatusId } }, err => {
        if (err) return res.json({ status: ERROR, message: 'Error updating leads in bulk action' });
        
        return res.json({ status: SUCCESS, data: { message: 'Lead statuses updated' } });
    });
    
    /*let bulk = User.collection.initializeOrderedBulkOp();
    
    bulk.find({ 'leads._id': { $in: req.body.leadIds } }).update({ $set: { 'leads.leadStatusId' : req.body.leadStatusId } });
    bulk.execute(err => {
        if (err) return res.json({ status: ERROR, message: 'Error updating leads in bulk action' });
        
        return res.json({ status: SUCCESS, data: { message: 'Lead statuses updated' } });
    });*/
});

//update
router.put('/:id', requireUser, excludeReadOnly, (req, res) => {
    const loggedInUser = req.loggedInUser;
    
    User.find({}, (err, users) => {
        if (err) return res.json({ status: ERROR, data: err, code: 500, message: 'Error finding user' });
        
        let leadIndex;
        let user;
        
        users.forEach(currentUser => {
            let currentLeadIndex = currentUser.leads.findIndex(lead => lead.id == req.params.id);
            if (currentLeadIndex > -1) {
                leadIndex = currentLeadIndex;
                user = currentUser;
            }
        });
        
        if (leadIndex < 0) return res.json({ status: ERROR, data: err, code: 404, message: 'Lead not found' });
        
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