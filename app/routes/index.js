'use strict';
var managePollsModule = require(process.cwd() + '/app/controllers/handler.server.js');

module.exports = function (app, db, ObjectId, passport) {
    
    var managePolls = new managePollsModule(db, ObjectId);
    
    app.route('/')
        .get(function (request, response) {
            if (!request.isAuthenticated()) {
                response.redirect('/login');
            } else {
                response.sendFile(process.cwd() + '/public/main.html');
            }
        });
        
    app.route('/login')
        .get(function (request, response) {
           response.sendFile(process.cwd() + '/public/intro.html');
        });
        
    app.route('/login=false')
        .get(function (request, response) {
            response.sendFile(process.cwd() + '/public/main.html');
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
            poll.date = date.toUTCString();
            poll._id = ObjectId();
            poll.author = request.user.username, null, 4;
            //handle multiple options
            var x = 1;
            for (var i in request.body) {
                if (request.body[i] !== '') {
                    if (i === 'pollName') {
                        poll.name = request.body[i];
                    } else {
                        var optN = 'opt' + x;
                        var optVote = optN + 'Vote'; 
                        poll[optN] = request.body[i];
                        poll[optVote] = 0;
                        x += 1;
                    }
                }
            }
            managePolls.insertPoll(request, response, poll);
        });
        
    app.route('/newOpt')
        .post(function (request, response) {
            console.log('route /newOpt');
            var opt = {};
            for (var i in request.body) {
                if (request.body[i] !== '') {
                    if (i !== 'ID') {
                        var optN = 'opt' + i.substr(i.indexOf("t") + 1);
                        var optVote  = optN + 'Vote'; 
                        opt[optN] = request.body[i];
                        opt[optVote] = 0;
                    }
                }
            }
            managePolls.insertOption(request, response, request.body['ID'], opt);
        });
    
    app.route('/my')
        .get(function (request, response) {
            console.log('route /my');
            var user = JSON.stringify(request.user.username, null, 4).replace(/["]+/g, '');
            managePolls.myPolls(request, response, user);
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
        
        
    app.route('/logout')
        .get(function(request, response) {
            console.log('loggin out');
            request.logout();
            response.redirect('/');
        });
    
    app.route('/auth/github')
        .get(passport.authenticate('github'));
        
    app.route('/auth/github/callback')
        .get(passport.authenticate('github', { failureRedirect: '/' }),
            function(request, response) {
            response.redirect('/');
            }
        );
        
    app.route('/profile')
        .get(function(request, response) {
            var user = {
                logged: false
            };
            if (!request.isAuthenticated()) {
                // user not logged in, set to 'guest'
                user.username = 'Guest';
                response.json(user);
            } else {
                // user is logged in, set get username
                user.logged = true;
                user.username = request.user.username, null, 4;
                response.json(user);
            }
        });
        
    app.route('/share/:id')
        .get(function(request, response) {
            response.sendFile(process.cwd() + '/public/poll.html');
        });
        
    app.route('/delete/:id')
        .get(function(request, response) {
            var ID = request.params.id;
            managePolls.removePoll(request, response, ID);
        });
};