require('dotenv').config();

var config = {};

config.port = process.env.PORT || 3000;
config.clientId = process.env.CLIENT_ID;
config.clientSecret = process.env.CLIENT_SECRET;

module.exports = config;
