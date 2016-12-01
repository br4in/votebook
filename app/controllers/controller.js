/* global $ */

$(document).ready(function () {
    
    displayAllPolls('all');
    
    $('#content').on('click', 'a', function(event) {
        event.preventDefault();
        var ID = $(this).attr('href').replace('/poll/', '');
        displayPoll(ID);
    });

    var count = 1;
    $('#content').on('click', 'button', function(){
        var newOpt = '<input type="text" name="pollOpt' + count + '">';
        $('#poll-options-div').append(newOpt);
        count += 1;
    });
    
    $('.btn-all').click(function() {
        console.log('all-btn');
        displayAllPolls('all');
        $('#content-description').text("Here's the list of all posted polls");
    });
    
    $('.btn-new').click(function() {
        console.log('new poll');
        $('#content').empty();
        $('#content-description').text('Create a new poll');
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
        $('#content-description').text("Here's the list of all the polls you posted");
    });
    
    function displayAllPolls(route) {
        $("#content").empty();
        $.getJSON( "https://vote-app-br4in.c9users.io/" + route, function( result ) {
            for (var i = 0; i < result.length; i++) {
                //handle empty polls -- 'work on prevent posting blank polls'
                if (result[i]['name'] !== undefined) {
                    var pollName = JSON.stringify(result[i]['name']).replace(/["]+/g, '');
                    if (pollName.length > 61) {
                        pollName = pollName.substring(0,61) + '...';
                    }
                    var pollID = JSON.stringify(result[i]['_id']).replace(/["]+/g, '');
                
                    var pollDiv = '<a href="/poll/' + pollID + '"><div id="poll-div"><p id="poll-name">' + pollName + '</p></div></a>';

                    $("#content").append(pollDiv);
                }
            }
        });
    }
    
    function displayPoll(ID) {
        $('#content').empty();
        
        $.getJSON( "https://vote-app-br4in.c9users.io/poll/" + ID, function(result) {
            
            var pollName = JSON.stringify(result[0]['name']).replace(/["]+/g, '');
            if (pollName.length > 100) {
                pollName = pollName.substring(0,100) + '...';
            }
            $('#content-description').text(pollName);
            var pollDiv = `
            <div id="vote-options-div" class="left-side">
                <p>Options:</p>
            </div>
            <div id="vote-chart-div" class="right-side">
                <h1>chart goes here</h1>
            </div>
            `;

            $("#content").append(pollDiv);
            
            for (var i = 0; i < Object.size(result[0]); i++) {
                var opt = 'opt' + (i + 1);
                
                var optionText = JSON.stringify(result[0][opt]).replace(/["]+/g, '');
                var optionDiv = '<button class="vote-option">' + optionText + '</button>';
                $('#vote-options-div').append(optionDiv);
                console.log('appended');
            }
        });
    }
    
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size - 3; 
    };
});