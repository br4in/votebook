'use strict';
var managePollsModule = require(process.cwd() + '/app/controllers/handler.server.js');

// TEST!
var isLogged = true;

module.exports = function (app, db) {
    
    var managePolls = new managePollsModule(db);
    
    app.route('/')
        .get(function (request, response) {
            if (!isLogged) {
                response.redirect('/login');
            } else {
                response.sendFile(process.cwd() + '/public/main.html');
                
            }
        });
        
    app.route('/login')
        .get(function (request, response) {
           // load all posted polls and display them inside content div
           response.sendFile(process.cwd() + '/public/intro.html');
        });
        
    app.route('/all')
        .get(function (request, response) {
            console.log('route /all');
            managePolls.getAllPolls(request, response);
        });
};