'use strict';

var express = require("express"),
    routes = require("./app/routes/index.js"),
    path = require("path"),
    mongo = require("mongodb").MongoClient,
    ObjectId = require('mongodb').ObjectID,
    bodyParser = require('body-parser'),
    passport = require("passport"),
    GithubStrategy = require('passport-github').Strategy,
    session = require("express-session");

var app = express();

var url = 'mongodb://127.0.0.1:27017/votebook';

mongo.connect(url, function (error, db) {
    if (error) throw error;
    console.log('Successfully connected on port 27017');
    
    app.use(express.static(path.join(__dirname, '/public')));
    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({secret: "-- ENTER CUSTOM SESSION SECRET --"}));
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.use(new GithubStrategy({
        clientID: "611e4add63e956fe7b7d",
        clientSecret: "ecff527971270e2c39c10fe3e312b8c91dc96650",
        callbackURL: "https://vote-app-br4in.c9users.io/auth/github/callback"
        },
        function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
        }
    ));
    
    passport.serializeUser(function(user, done) {
        // placeholder for custom user serialization
        // null is for errors
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        // placeholder for custom user deserialization.
        // maybe you are going to get the user from mongo by id?
        // null is for errors
        done(null, user);
    });
    
    routes(app, db, ObjectId, passport);

    app.listen('8080', function () {
        console.log('Server listening on port 8080.');
    });
});

