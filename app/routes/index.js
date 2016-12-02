'use strict';
var managePollsModule = require(process.cwd() + '/app/controllers/handler.server.js');

// TEST!
var isLogged = false;

module.exports = function (app, db, ObjectId) {
    
    var managePolls = new managePollsModule(db, ObjectId);
    
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
            console.log(request.body);
            var date = new Date();
            // create poll object
            var poll = {};
            poll.date = date.toUTCString();
            poll._id = ObjectId();
            //handle multiple options
            var x = 1;
            for (var i in request.body) {
                if (request.body[i] !== '') {
                    if (i === 'pollName') {
                        poll.name = request.body[i];
                    } else {
                        var optN = 'opt' + x;
                        var optVote  = optN + 'Vote'; 
                        poll[optN] = request.body[i];
                        poll[optVote] = 0;
                        x += 1;
                    }
                }
            }
            
            managePolls.insertPoll(request, response, poll);
        });
    
    app.route('/my')
        .get(function (request, response) {
            console.log('route /my');
            managePolls.myPolls(request, response);
        });
        
    app.route('/poll/:id')
        .get(function (request, response) {
            console.log('route /poll');
            var ID = request.params.id;
            managePolls.showPoll(request, response, ID);
        });
        
    app.route('/vote/:id/:opt')
        .get(function (request, response) {
            console.log('route /vote/id/opt');
            var ID = request.params.id;
            var opt = request.params.opt;
            managePolls.votePoll(request, response, ID, opt);
        });
};