/* global $ */

$(document).ready(function () {
    // !! review code and use only the global declare var 'id'
    
    // user variables
    var user, isLogged, ID, hasVoted = false;
    var pollOptions = 0, newPollOption = 0, count = 1;
    var htmlFile = window.location.pathname;
    
    // init
    getUserInfo();
    
    if (htmlFile.substring(0, 7) === '/share/') {
        ID = htmlFile.substring(7,htmlFile.length);
        displayPoll(ID);
    } else {
        // display all polls 
        displayAllPolls('all');
    }
    
    // ----------------------------- Listeners -----------------------------
    // listen for clicked poll
    $('#content').on('click', 'a', function(event) {
        var href = $(this).attr('href');
        if (href.substring(0, 6) === '/poll/') {
            ID = $(this).attr('href').replace('/poll/', '');
            displayPoll(ID);
            event.preventDefault();
        } else {
            deletePoll(href);
            event.preventDefault();
        }
        
    });
    
    // listen for clicked poll's option
    $('#content').on('click', '.vote-option', function() {
        if (!hasVoted) {
            var url = $(this).attr('href');
            votePoll(url, ID);
            hasVoted = true;
        } else {
            alert('Shame on you!');
        }
    });
    
    // listen for '+' btn clicked and append new input
    $('#content').on('click', 'button', function(){
        var newOptN = pollOptions + 1;
        var newOpt = '<input type="text" name="pollOpt' + count + '">';
        var newOptLate = '<form method="post" action="/newOpt" id="poll-form">\
        <input type="text" name="pollOpt' + newOptN + '">\
        <input type="hidden" name="ID" value=' +ID+ '>\
        <input id="submit-btn" type="submit">';
        if ($(this).attr('id') === 'add-opt-btn' && newPollOption === 0) {
            // when creating option in new poll
            $('#poll-options-div').append(newOpt);
            count += 1;
        } else if ($(this).attr('id') === 'add-opt-btn-late' && newPollOption === 0) {
            // when creating option in existing poll
            $('#vote-options-div').append(newOptLate);
            newPollOption += 1;
        }
    });
    
    // handle btn-all click
    $('.btn-all').click(function() {
        displayAllPolls('all');
        $('#content-description').text("Here's the list of all posted polls");
    });
    
    // handle btn-new click and display form 
    $('.btn-new').click(function() {
        if (isLogged) {
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
        } else {
            alert('You need to be logged-in to create a new poll');
        }
    });
    
    // handle btn-my click and display user's polls
    $('.btn-my').click(function() {
        if (isLogged) {
            displayAllPolls('my');
            $('#content-description').text("Here's the list of all the polls you posted");
        } else {
            alert('You need to be logged-in to see your polls');
        }
    });
    
    // handle profile page link from guest user
    $('#profile-link').click(function(event) {
        if (!isLogged) {
            alert('You need to be logged-in to see your profile');
            event.preventDefault();
        }
    });
    
    // ----------------------------- Functions -----------------------------
    // display all polls in db
    function displayAllPolls(route) {
        $("#content").empty();
        hasVoted = false;
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
                    var pollDivAuth = '<a href="/poll/' + pollID + '"><div id="poll-div"><p id="poll-name-my">' + pollName + '</p><a id="delete-poll" href="/delete/' + pollID + '">Delete</a></div></a>';
                    
                    if (route === 'my') {
                        $("#content").append(pollDivAuth);
                        console.log(route);
                    } else {
                        $("#content").append(pollDiv);
                    }
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
            if (result.length !== 0) {
                // get poll name and edit it if too large
                var pollName = JSON.stringify(result[0]['name']).replace(/["]+/g, '');
                if (pollName.length > 100) {
                    pollName = pollName.substring(0,100) + '...';
                }
                var pollUrl =  "https://vote-app-br4in.c9users.io/share/" + ID;
            
                $('#content-description').text(pollName);
                // create div 
                var pollDiv = `
                <div id="vote-options-div" class="left-side">
                    <p>Options:</p>
                </div>
                <div id="vote-chart-div" class="right-side">
                    <canvas id="myChart"></canvas>
                </div>
                <div id="link-div">
                    <p>`+ pollUrl +`</p>
                </div>
                `;
            
                // append it 
                $("#content").append(pollDiv);
            
                // if user is logged, display add btn
                if (isLogged) {
                    var addBtn = '<button type="button" id="add-opt-btn-late"></button>';
                    $('#vote-options-div').prepend(addBtn);
                }
            
                // determine how many options the poll has and append them
                pollOptions = 0;
                for (var i = 0; i < Object.size(result[0]); i++) {
                    var opt = 'opt' + (i + 1);
                    var optVote = opt + 'Vote';
                    var optionText = JSON.stringify(result[0][opt]).replace(/["]+/g, '');
                    var optionVote = JSON.stringify(result[0][optVote]).replace(/["]+/g, '');
                    opts.push(optionText);
                    optsVotes.push(optionVote);
                    var optionDiv = '<button href="' + ID + '/' + optVote + '" class="vote-option">' + optionText + '</button>';
                    $('#vote-options-div').append(optionDiv);
                    pollOptions += 1;
                }
            
                // display chart
                var ctx = document.getElementById("myChart").getContext('2d');
                var myChart = new Chart(ctx, {
                    type: 'doughnut',
                    responsive: false,
                    data: {
                        labels: opts,
                        datasets: [{
                            backgroundColor: randomColor(opts),
                        data: optsVotes
                        }]
                    }
                });
                } else {
                    alert('The poll you requested does not exist.');
                    displayAllPolls('all');
                }
            });
        }
    
    // vote poll and refresh data
    function votePoll (url, ID) {
        $.getJSON("https://vote-app-br4in.c9users.io/vote/" + url, function(result) {
            displayPoll(ID);
        });
    }
    
    // loop through a JSON obj and return its length
    // minus 4 to remove : _id, date, name, author.
    // divided by 2 to remove the votes fields
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return (size - 4) / 2;
    };
    
    // pick random color for each option
    function randomColor(opts) {
        var colors = ['red', 'blue', 'green', 'gray', 'black', 'dodgerblue', 'brown', 'yellow', 'cyan', 'purple', 'orange', 'gold', 'pink', 'silver'];
        var optsColors = [];
        for (var i = 0; i < opts.length; i++) {
            // pick a random color, then remove it from the array
            var color = colors[Math.floor(Math.random() * colors.length)];
            optsColors.push(color);
            var index = colors.indexOf(color);
            colors.splice(index, 1);
        }
        return optsColors;
    }
    
    // get user info and display them on page
    function getUserInfo() {
        $.getJSON("https://vote-app-br4in.c9users.io/profile", function(result) {
            if (result !== undefined) {
                // get username
                user = result.username;
                // get login status
                isLogged = result.logged;
                
                // display info
                $('#user-name').text(user);
                if (isLogged) {
                    $('#log-status').text('Logout');
                    $('#log-status').attr('href', '/logout');
                } else {
                    $('#log-status').text('Login');
                    $('#log-status').attr('href', '/login');
                }
            }
        });
    }
    
    function deletePoll(url) {
        $.getJSON(url, function(result) {
            console.log('poll deleted');
            displayAllPolls('my');
        });
    }
});