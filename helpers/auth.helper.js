const jwt = require('jsonwebtoken');

function isAuthorized(req, res, next) {

    if (typeof bearerHeader !== 'undefined') {
        const bearer = req.headers['authorization'].split(' ');
        const token = bearer[1];
        
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            console.log('test')
            if (err) return res.json({ error: err });
            
            if (req.params.id !== decoded.id) return res.json({ error: 'Not Authorized' });
            
            next();
        });
    } else {
        console.log('not authenticated');
        res.json({ error: 'Must Log in to continue' });
    }
}

module.exports = isAuthorized;