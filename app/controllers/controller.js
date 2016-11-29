/* global $ */

$(document).ready(function () {
    $('.btn-all').click(function() {
        console.log('all-btn');
        displayAllPolls();
    });
    
    $('.btn-new').click(function() {
        console.log('new poll');
    });
    
    $('.btn-my').click(function() {
        console.log('my polls');
    });
    
    
    
    function displayAllPolls() {
        $.getJSON( "https://vote-app-br4in.c9users.io/all", function( result ) {
            // $.each(result, function(i, field){
            //     $("#content").append(JSON.stringify(field) + " ");
            // });
            $("#content").append(JSON.stringify(result[0]['name']));
            // for (var i = 0; i < result.length; i++) {
            //     var poll = {};
            //     poll.name = result[i][0];
            //     $("#content").append(poll.name);
            // }
        });
}
});

