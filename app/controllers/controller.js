/* global $ */

$(document).ready(function () {
    displayAllPolls('all');
    
    // handle form submission
    $('form').submit(function() {
        console.log('not submitted');
        return false;
    });
    
    $('.btn-all').click(function() {
        console.log('all-btn');
        displayAllPolls('all');
    });
    
    $('.btn-new').click(function() {
        console.log('new poll');
        $('#content').empty();
        var pollForm = '<form method="post" action="/new"><input type="text" name="pollName"><input type="text" name="pollOpt"><input id="submit-btn" type="submit"></form>';
        $("#content").append(pollForm);
    });
    
    $('.btn-my').click(function() {
        console.log('my polls');
        displayAllPolls('my');
    });
    
    // handle form submission
    $('form').submit(function() {
        console.log('not submitted');
        return false;
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