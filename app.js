// Require modules
var config = require('./config');
var text = require('./src/textResolver');

var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var storage = require('node-persist');
var slack = require('slack-notify')(config.slackHookUri);

// Init Express
var app = express();

// Init storage sync
storage.initSync();
storage.setItemSync('temp', 0);

// Support json encoded bodies
app.use(bodyParser.json());
// Support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Lets start our server
app.listen(config.port, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Slack Coffee app listening on port " + config.port);
});

// Status command
app.get('/', function(req, res) {
    res.send({
        'Message': "Slack Coffee server up and running! ",
        'RequestPath': req.url
    })
});

// Update temperature
app.post('/temperature/update', function(req, res) {
    if (!req.body.temp) {
        res.status(500);
        res.send({'Error': "Looks like we're not getting a valid temperature."});
        console.log("Looks like we're not getting a valid temperature.");
    } else {
        // Store temperature value
        storage.setItemSync('temp', req.body.temp);

        res.send({
            'Success': true,
            'Data': {
                'Temp': storage.getItemSync('temp')
            },
        });

        // Send Slack notification
        slack.note(text.temperature(storage.getItemSync('temp')));
    }   
});

// Slack oAuth
app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. 
    // If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({'Error': "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // We'll do a GET call to Slack's `oauth.access` endpoint.
        request({
            url: 'https://slack.com/api/oauth.access',
            qs: {code: req.query.code, client_id: config.clientId, client_secret: config.clientSecret},
            method: 'GET',

        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                res.json(body);

            }
        })
    }
});

// Coffee command
app.post('/command/coffee', function(req, res) {
    // Check is temperature check variable is passed
    if (req.body.temp) {
        res.send("Your coffee is " + storage.getItemSync('temp') + " &#8451;.");
    }

    res.send(text.temperature(storage.getItemSync('temp')));
});
