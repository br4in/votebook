'use strict';

var express = require("express"),
    routes = require("./app/routes/index.js"),
    path = require("path"),
    mongo = require("mongodb").MongoClient;

var app = express();

var url = 'mongodb://127.0.0.1:27017/votebook';

mongo.connect(url, function (error, db) {
    if (error) throw error;
    console.log('Successfully connected on port 27017');
    
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.static(path.join(__dirname, 'app/controllers')));
    
    routes(app, db);

    app.listen('8080', function () {
        console.log('Server listening on port 8080.');
    });
});

