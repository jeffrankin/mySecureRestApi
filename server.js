/**
 * Created by jjrankin on 1/18/15.
 */
var express = require('express');
var https = require('https');
var fs = require('fs');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var key = fs.readFileSync('./jjrankin-key.pem');
var cert = fs.readFileSync('./jjrankin-cert.pem');
var https_options = {
    key: key,
    cert: cert
};

app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

app.all('/*', function(req, res, next) {
    // CORS Headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it the the required domain
    res.header("Access-Control-Allow-Methods", 'GET,OPTIONS');
    // set custom headers for CORS
    res.header("Access-Control-Allow-Headers", 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token
// Any URL's that do not follow the below pattern should be avoided unless
// you are sure that authentication is not needed.
app.all('/api/v1/*', [require('./middlewares/validateRequest')]);

app.user('/', require('./routes'));

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Start the server
app.set('port', process.env.PORT || 3000);
app.set('host', 'brook.local');

server = https.createServer(https_options, app).listen(app.get('port'), app.get('host'));
console.log('HTTPS Server listening on %s:%s', app.get('host'), app.get('port'));