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
    
    this.myPolls = function (request, response) {
        collection.find({
            'author': 'br4in'
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
}

module.exports = managePolls;

