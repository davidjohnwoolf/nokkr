const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    if (req.get('Authorization')) {
        
        const token = req.get('Authorization').split(' ')[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) return res.status(401).json({ error: true, message: 'Authenticatiom failed' });

            next();
        });
        
    } else {
        
        res.status(401).json({ error: true, message: 'Authenticatiom failed' });
    }
};


module.exports = verifyToken;