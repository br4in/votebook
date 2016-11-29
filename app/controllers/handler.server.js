'use strict';

function managePolls (db) {
    var collection = db.collection('polls');
    
    this.getAllPolls = function (request, response) {
        console.log('Find all docs in db');
        var clickProjection = { '_id': false };
        
        collection.find({}, clickProjection).toArray(function(error, result) {
            if (error) console.log(error);
            console.log(result);
            response.json(result);
        });
    };
    
    this.insertPoll = function (request, response, poll) {
        
        collection.insert(poll, function (error, data) {
           if (error) throw error;
           console.log(data);
           
        });
    };
    
    this.myPolls = function (request, response) {
        collection.find({
            'author': 'br4in'
        }).toArray(function (error, docs) {
            if (error) throw error;
            response.json(docs);
        });
    };
}

module.exports = managePolls;

