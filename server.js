'use strict';

var express = require("express"),
    routes = require("./app/routes/index.js");

var app = express();

routes(app);

app.listen('8080', function () {
    console.log('Server listening on port 8080.');
});