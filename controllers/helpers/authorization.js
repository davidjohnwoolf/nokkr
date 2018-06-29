const jwt = require('jsonwebtoken');

//status variables for Jsend API spec
const { SUCCESS, FAIL, ERROR } = require('./api-variables');

const requireSuperUser = (req, res, next) => {
    if (req.get('Authorization')) {
        
        const token = req.get('Authorization').split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) return res.json({ status: ERROR, data: err, code: 401, message: 'Token not valid' });
            
            //set logged in user for the request
            req.loggedInUser = decoded;
            
            if (!decoded.isSuperUser) {
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
            
            if (!decoded.isAdmin && !decoded.isSuperUser) {
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
            
            if (!decoded.isManager && !decoded.isAdmin && !decoded.isSuperUser) {
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
    if (req.get('Authorization')) {
        
        const token = req.get('Authorization').split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) return res.json({ status: ERROR, data: err, code: 401, message: 'Token not valid' });
            
            //set logged in user for the request
            req.loggedInUser = decoded;
            
            if (decoded.isReadOnly) {
                return res.json({ status: ERROR, code: 403, message: 'Permission Denied' });
            }

            next();
        });
        
    } else {
        
        return res.json({ status: ERROR, code: 401, message: 'No authorization header' });
    }
};

module.exports = {
    requireSuperUser,
    requireAdmin,
    requireManager,
    requireUser,
    excludeReadOnly
};