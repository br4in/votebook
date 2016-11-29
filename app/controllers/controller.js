/* global $ */

$(document).ready(function () {
    displayAllPolls('all');
    
    $('.btn-all').click(function() {
        console.log('all-btn');
        displayAllPolls('all');
    });
    
    $('.btn-new').click(function() {
        console.log('new poll');
        $.getJSON( "https://vote-app-br4in.c9users.io/new", function( result ) {
            console.log(JSON.stringify(result)); 
        });
    });
    
    $('.btn-my').click(function() {
        console.log('my polls');
        displayAllPolls('my');
    });
    
    
    
    function displayAllPolls(route) {
        $("#content").empty();
        $.getJSON( "https://vote-app-br4in.c9users.io/" + route, function( result ) {
            for (var i = 0; i < result.length; i++) {
                var poll = {};
                poll.name = JSON.stringify(result[i]['name']);
                var pollDiv = '<div id="poll-div"><p id="poll-name">' + poll.name + '</p></div>';
            
                $("#content").append(pollDiv);
            }
            
        });
}
});