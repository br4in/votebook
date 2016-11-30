/* global $ */

$(document).ready(function () {
    
    displayAllPolls('all');

    var count = 1;
    $('#content').on('click', 'button', function(){
        console.log('more options clicked');
        var newOpt = '<input type="text" name="pollOpt' + count + '">';
        $('#poll-options-div').append(newOpt);
        count += 1;
    });
    
    $('.btn-all').click(function() {
        console.log('all-btn');
        displayAllPolls('all');
    });
    
    $('.btn-new').click(function() {
        console.log('new poll');
        $('#content').empty();
        var pollForm = `
            <form method="post" action="/new" id="poll-form">
                <div id="poll-name-div">
                    <p>Poll name: </p>
                    <input type="text" name="pollName">
                </div>
                <p>Poll options: </p>
                <button type="button" id="add-opt-btn"></button>
                <div id="poll-options-div">
                    <input type="text" name="pollOpt">
                    <input type="text" name="pollOpt0">
                </div>
                <input id="submit-btn" type="submit">
            </form>`;
        $("#content").append(pollForm);
    });
    
    $('.btn-my').click(function() {
        console.log('my polls');
        displayAllPolls('my');
    });
    
    function displayAllPolls(route) {
        $("#content").empty();
        $.getJSON( "https://vote-app-br4in.c9users.io/" + route, function( result ) {
            for (var i = 0; i < result.length; i++) {
                var pollName = JSON.stringify(result[i]['name']).replace(/["]+/g, '');
                
                var pollDiv = '<div id="poll-div"><p id="poll-name">' + pollName + '</p></div>';

                $("#content").append(pollDiv);
            }
            
        });
}
});