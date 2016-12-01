'use strict';

var express = require("express"),
    routes = require("./app/routes/index.js"),
    path = require("path"),
    mongo = require("mongodb").MongoClient,
    ObjectId = require('mongodb').ObjectID,
    bodyParser = require('body-parser');

var app = express();

var url = 'mongodb://127.0.0.1:27017/votebook';

mongo.connect(url, function (error, db) {
    if (error) throw error;
    console.log('Successfully connected on port 27017');
    
    app.use(express.static(path.join(__dirname, '/public')));
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
    app.use(bodyParser.urlencoded({ extended: false }));
    
    
    routes(app, db, ObjectId);

    app.listen('8080', function () {
        console.log('Server listening on port 8080.');
    });
});

