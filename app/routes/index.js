'use strict';

module.exports = function (app, db) {
    app.route('/')
        .get(function (request, response) {
            response.sendFile(process.cwd() + '/public/intro.html');
        });
};