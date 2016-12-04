'use strict';

function managePolls (db, ObjectId) {
    var collection = db.collection('polls');
    
    this.getAllPolls = function (request, response) {
        console.log('Find all docs in db');
        
        collection.find({}).sort({
			date: -1                                // polls of older day don't
            }).toArray(function(error, result) {    // get sorted correctly
                if (error) console.log(error);
                console.log(result);
                response.json(result);
        });
    };
    
    this.insertPoll = function (request, response, poll) {
        
        collection.insert(poll, function (error, data) {
           if (error) throw error;
           console.log(data);
           response.redirect('/');
        });
    };
    
    this.myPolls = function (request, response, user) {
        collection.find({
            author: user
        }).toArray(function (error, docs) {
            if (error) throw error;
            response.json(docs);
        });
    };
    
    this.showPoll = function (request, response, ID) {
        collection.find({
            '_id': ObjectId(ID)
        }).toArray(function (error, result) {
            if (error) throw error;
            response.json(result);
        });  
    };
    
    this.votePoll = function (request, response, ID, opt) {
        var variable = opt;
        var action = {};
        action[variable] = 1;
        
        collection.update({
            '_id': ObjectId(ID)
        }, {
            $inc: action
        });
        var result = {
            result: 'Vote added'
        };
        response.json(result);
    };
    
    this.removePoll = function (request, response, ID) {
        collection.remove({
            _id: ObjectId(ID)
        });
        var result = {
            result: 'Poll deleted'
        };
        response.json(result);
    };
    
    this.insertOption = function (request, response, ID, opt) {
        console.log(opt);
        collection.update({
            '_id': ObjectId(ID)
        }, {
            $set: opt
        });
        response.redirect('/share/'+ ID);
    };
}

module.exports = managePolls;

