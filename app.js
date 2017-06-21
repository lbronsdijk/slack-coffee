// Require modules
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

// Slack credentials. 
var clientId = '200533262887.201265587335';
var clientSecret = '5b73aec95924431571f61471018e0228';

// Init Express
var app = express();

// Define port
var port = process.env.PORT || 3000;

// Support json encoded bodies
app.use(bodyParser.json());
// Support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Lets start our server
app.listen(port, function () {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Slack Coffee app listening on port " + port);
});

// Status command
app.get('/', function(req, res) {
    res.send({
        "Message": "Slack Coffee server up and running!",
        "RequestPath": req.url
    })
});

// Test command
app.post('/test', function(req, res) {
    var responseText = "Chuck Norris is testing...";

    if (req.body.text) {
        responseText = reponseText + " You said: " + req.body.text;
    }

    res.send(responseText);
});

// Slack oAuth
app.get('/oauth', function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. 
    // If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // We'll do a GET call to Slack's `oauth.access` endpoint.
        request({
            url: 'https://slack.com/api/oauth.access',
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret},
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
