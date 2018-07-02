const jwt = require('jsonwebtoken');

//status variables for Jsend API spec and role constants
const { SUCCESS, FAIL, ERROR, USER, MANAGER, ADMIN, SU } = require('../../lib/constants');

const requireSuperUser = (req, res, next) => {
    if (req.get('Authorization')) {
        
        const token = req.get('Authorization').split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) return res.json({ status: ERROR, data: err, code: 401, message: 'Token not valid' });
            
            //set logged in user for the request
            req.loggedInUser = decoded;
            
            if (decoded.role !== SU) {
                return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
            }

            next();
        });
        
    } else {
        
        return res.json({ status: ERROR, code: 401, message: 'No authorization header' });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.get('Authorization')) {
        
        const token = req.get('Authorization').split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) return res.json({ status: ERROR, data: err, code: 401, message: 'Token not valid' });
            
            //set logged in user for the request
            req.loggedInUser = decoded;
            
            if ((decoded.role !== SU) && (decoded.role !== ADMIN)) {
                return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
            }

            next();
        });
        
    } else {
        
        return res.json({ status: ERROR, code: 401, message: 'No authorization header' });
    }
};

const requireManager = (req, res, next) => {
    if (req.get('Authorization')) {
        
        const token = req.get('Authorization').split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) return res.json({ status: ERROR, data: err, code: 401, message: 'Token not valid' });
            
            //set logged in user for the request
            req.loggedInUser = decoded;
            
            if (decoded.role === USER) {
                return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
            }

            next();
        });
        
    } else {
        
        return res.json({ status: ERROR, code: 401, message: 'No authorization header' });
    }
};

const requireUser = (req, res, next) => {
    if (req.get('Authorization')) {
        
        const token = req.get('Authorization').split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) return res.json({ status: ERROR, data: err, code: 401, message: 'Token not valid' });
            
            //set logged in user for the request
            req.loggedInUser = decoded;

            next();
        });
        
    } else {
        
        return res.json({ status: ERROR, code: 401, message: 'No authorization header' });
    }
};

const excludeReadOnly = (req, res, next) => {

    if (req.loggedInUser.isReadOnly) {
        return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
    }

    next();

};

module.exports = {
    requireSuperUser,
    requireAdmin,
    requireManager,
    requireUser,
    excludeReadOnly
};