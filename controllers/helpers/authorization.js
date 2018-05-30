const jwt = require('jsonwebtoken');

//status variables for Jsend API spec
const SUCCESS = 'success';
const FAIL = 'fail';
const ERROR = 'error';

const verifyToken = (req, res, next) => {

    if (req.get('Authorization')) {
        
        const token = req.get('Authorization').split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) return res.json({ status: ERROR, data: err, code: 401, message: 'Token not valid' });

            next();
        });
        
    } else {
        
        res.json({ status: ERROR, code: 401, message: 'No authorization header' });
    }
};


module.exports = verifyToken;