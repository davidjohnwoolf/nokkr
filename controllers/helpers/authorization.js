const jwt = require('jsonwebtoken');

//status variables for Jsend API spec
const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

const requireSuperUser = (req, res, next) => {
    if (req.get('Authorization')) {
        
        const token = req.get('Authorization').split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) return res.json({ status: ERROR, data: err, code: 401, message: 'Token not valid' });
            
            if (!decoded.isSuperUser) {
                return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
            }

            next();
        });
        
    } else {
        
        res.json({ status: ERROR, code: 401, message: 'No authorization header' });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.get('Authorization')) {
        
        const token = req.get('Authorization').split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) return res.json({ status: ERROR, data: err, code: 401, message: 'Token not valid' });
            
            if (!decoded.isAdmin && !decoded.isSuperUser) {
                return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
            }

            next();
        });
        
    } else {
        
        res.json({ status: ERROR, code: 401, message: 'No authorization header' });
    }
};

const requireManager = (req, res, next) => {
    if (req.get('Authorization')) {
        
        const token = req.get('Authorization').split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) return res.json({ status: ERROR, data: err, code: 401, message: 'Token not valid' });
            
            //make sure this works for all routes, maybe be more specific with IDs
            if ((!decoded.isManager && (!req.params.teamId || (decoded.teamId === req.params.teamId))) && !decoded.isAdmin && !decoded.isSuperUser) {
                return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
            }

            next();
        });
        
    } else {
        
        res.json({ status: ERROR, code: 401, message: 'No authorization header' });
    }
};

const requireNotReadOnly = (req, res, next) => {
    if (req.get('Authorization')) {
        
        const token = req.get('Authorization').split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) return res.json({ status: ERROR, data: err, code: 401, message: 'Token not valid' });
            
            if (decoded.isReadOnly) {
                return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
            }

            next();
        });
        
    } else {
        
        res.json({ status: ERROR, code: 401, message: 'No authorization header' });
    }
};

module.exports = {
    requireSuperUser,
    requireAdmin,
    requireManager,
    requireNotReadOnly
};