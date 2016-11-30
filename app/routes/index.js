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
           isLogged = true;
           response.sendFile(process.cwd() + '/public/intro.html');
        });
        
    app.route('/all')
        .get(function (request, response) {
            console.log('route /all');
            
            managePolls.getAllPolls(request, response);
        });
        
    app.route('/new')
        .post(function (request, response) {
            console.log('route /new');
            
            var date = new Date();
            // create poll object
            var poll = {};
            //handle multiple options
            var x = 1;
            for (var i in request.body) {
                if (request.body[i] !== '') {
                    if (i === 'pollName') {
                        poll.name = request.body[i];
                    } else {
                        var optN = 'opt' + x;
                        poll[optN] = request.body[i];
                        x += 1;
                    }
                }
            }
            poll.date = date.toUTCString();
            managePolls.insertPoll(request, response, poll);
        });
    
    app.route('/my')
        .get(function (request, response) {
            console.log('route /my');
            managePolls.myPolls(request, response);
        });
};