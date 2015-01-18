/**
 * Created by jjrankin on 1/18/15.
 */
var jwt = require('jwt-simple');

var auth = {
    login: function(req, res) {
        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid Credentials"
            });
            return;
        }

        // fire a query to the DB and check if the credentials are valid
        var dbUserObj = auth.validate(username, password);

        if (!dbUserObj) {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid Credentials"
            });
            return;
        }

        if (dbUserObj) {
            // if authentication is a success, we will generate a token
            // and dispatch to client
            res.json(genToken(dbUserObj));
        }
    },

    validate: function(username, password) {
        // spoofing the DB response for simplicity
        var dbUserObj = {
            name: 'jeff',
            role: 'admin',
            username: 'rankin6@llnl.gov'
        };

        return dbUserObj;
    },

    validateUser: function(username) {
        // for simplicity
        var dbUserObj = {
            name: 'jeff',
            role: 'admin',
            username: 'rankin6@llnl.gov'
        };

        return dbUserObj;
    }
}

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires
    }, require('../config/secret')());

    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;