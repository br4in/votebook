'use strict';
var managePollsModule = require(process.cwd() + '/app/controllers/handler.server.js');

// TEST!
var isLogged = false;

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
           isLogged = true;
           response.sendFile(process.cwd() + '/public/intro.html');
        });
        
    app.route('/all')
        .get(function (request, response) {
            console.log('route /all');
            managePolls.getAllPolls(request, response);
        });
        
    app.route('/new')
    // TEST!!
        .post(function (request, response) {
            console.log('route /new');
            var date = new Date();
            
            var name = request.body.pollName;
            var author = 'br4in';
            var poll = {
                'name': name,
                'author': author,
                'date': date.toUTCString()
            };
            // handle multiple options --- leaving incomplete --- continuing tomorrow
            // for (var i = 1; i < request.body; i++) {
            //     poll.opt = request.body[i];
            // }
            
            managePolls.insertPoll(request, response, poll);
        });
    
    app.route('/my')
        .get(function (request, response) {
            console.log('route /my');
            managePolls.myPolls(request, response);
        });
};