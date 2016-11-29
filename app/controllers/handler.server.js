'use strict';

function managePolls (db) {
    var collection = db.collection('polls');
    
    this.getAllPolls = function (request, response) {
        console.log('Find all docs in db');
        var clickProjection = { '_id': false };
        
        collection.find({}, clickProjection).toArray(function(error, result) {
            if (error) throw error;
            console.log(result);
            response.json(result);
        });
    };
    
    this.insertPoll = function (request, response) {
        var poll = {
            'name': 'this is a test',
            'author': 'user1',
            'option1': 'test2',
            'option2': 'test3'
        };
        collection.insert(poll, function (error, data) {
           if (error) throw error;
           console.log(data);
           db.close();
        });
    };
    
    this.myPolls = function (request, response) {
        collection.find({
            'author': 'user1'
        }).toArray(function (error, docs) {
            if (error) throw error;
            console.log(docs);
            db.close();
        });
    };
}

module.exports = managePolls;
