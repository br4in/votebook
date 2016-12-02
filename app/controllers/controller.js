/* global $ */

$(document).ready(function () {
    // display all polls 
    displayAllPolls('all');
    
    // listen for clicked poll
    $('#content').on('click', 'a', function(event) {
        event.preventDefault();
        var ID = $(this).attr('href').replace('/poll/', '');
        displayPoll(ID);
    });
    
    // listen for clicked poll's option
    $('#content').on('click', '.vote-option', function() {
        var url = $(this).attr('href');
        var ID = url.substring(0, url.lastIndexOf('/'));
        votePoll(url, ID);
    });
    
    // listen for '+' btn clicked and append new input
    var count = 1;
    $('#content').on('click', 'button', function(){
        var newOpt = '<input type="text" name="pollOpt' + count + '">';
        $('#poll-options-div').append(newOpt);
        count += 1;
    });
    
    // handle btn-all click
    $('.btn-all').click(function() {
        console.log('all-btn');
        displayAllPolls('all');
        $('#content-description').text("Here's the list of all posted polls");
    });
    
    // handle btn-new click and display form 
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
    
    // // handle btn-my click and display user's polls
    $('.btn-my').click(function() {
        console.log('my polls');
        displayAllPolls('my');
        $('#content-description').text("Here's the list of all the polls you posted");
    });
    
    // display all polls in db
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
    
    // display a single poll and its values
    function displayPoll(ID) {
        $('#content').empty();
        // create array to store poll's options to use for creating the chart
        var opts = [];
        var optsVotes = [];
        
        $.getJSON( "https://vote-app-br4in.c9users.io/poll/" + ID, function(result) {
            // get poll name and edit it if too large
            var pollName = JSON.stringify(result[0]['name']).replace(/["]+/g, '');
            if (pollName.length > 100) {
                pollName = pollName.substring(0,100) + '...';
            }
            
            $('#content-description').text(pollName);
            // create div 
            var pollDiv = `
            <div id="vote-options-div" class="left-side">
                <p>Options:</p>
            </div>
            <div id="vote-chart-div" class="right-side">
                <canvas id="myChart"></canvas>
            </div>
            `;
            
            // append it 
            $("#content").append(pollDiv);
            
            // determine how many options the poll has and append them
            for (var i = 0; i < Object.size(result[0]); i++) {
                var opt = 'opt' + (i + 1);
                var optVote = opt + 'Vote';
                
                var optionText = JSON.stringify(result[0][opt]).replace(/["]+/g, '');
                var optionVote = JSON.stringify(result[0][optVote]).replace(/["]+/g, '');
                opts.push(optionText);
                optsVotes.push(optionVote);
                console.log(optionText, optionVote);
                var optionDiv = '<button href="' + ID + '/' + optVote + '" class="vote-option">' + optionText + '</button>';
                $('#vote-options-div').append(optionDiv);
                
            }
            
            // display chart
            var ctx = document.getElementById("myChart").getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: opts,
                    datasets: [{
                        backgroundColor: randomColor(opts),
                    data: optsVotes
                    }]
                }
            });
            
        });
    }
    
    function votePoll (url, ID) {
        $.getJSON("https://vote-app-br4in.c9users.io/vote/" + url, function(result) {
            displayPoll(ID);
        });
    }
    
    // loop through a JSON obj and return its length
    // minus 3 to remove : _id, date, name.
    // divided by 2 to remove the votes fields
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        
        return (size - 3) / 2;
    };
    
    // pick random color from number of options
    function randomColor(opts) {
        var colors = ['red', 'blue', 'green', 'gray', 'black', 'dodgerblue', 'brown', 'yellow', 'cyan', 'purple'];
        var optsColors = [];
        
        for (var i = 0; i < opts.length; i++) {
            optsColors.push(colors[Math.floor(Math.random() * colors.length)]);
        }
        
        return optsColors;
    }
    
});