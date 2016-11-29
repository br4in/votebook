/* global $ */

$(document).ready(function () {
    $('.btn-all').click(function() {
        console.log('all-btn');
        displayAllPolls();
    });
    
    $('.btn-new').click(function() {
        console.log('new poll');
        $.getJSON( "https://vote-app-br4in.c9users.io/new", function( result ) {
            console.log(JSON.stringify(result)); 
        });
    });
    
    $('.btn-my').click(function() {
        console.log('my polls');
    });
    
    
    
    function displayAllPolls() {
        $("#content").empty();
        $.getJSON( "https://vote-app-br4in.c9users.io/all", function( result ) {
            for (var i = 0; i < result.length; i++) {
                var poll = {};
                poll.name = JSON.stringify(result[i]['name']);
                var pollDiv = '<div id="poll-div"><p id="poll-name">' + poll.name + '</p></div>';
            
                $("#content").append(pollDiv);
            }
            
        });
}
});