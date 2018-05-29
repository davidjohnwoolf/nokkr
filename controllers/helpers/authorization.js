const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    if (req.headers) {
        const token = req.get('Authorization').split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            //res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
            if (err) return res.json({ error: err, errorMessage: 'Authentication Failed' });

            next();
        });
    } else {
        //set up 401
        //res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
        res.json({ error: true, errorMessage: 'Authentication Failed' });
    }
};


module.exports = verifyToken;