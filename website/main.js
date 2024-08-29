// Function to update the navbar based on user authentication status
function updateNavbar(isAuthenticated) {
    var navbar = document.getElementById('navbar');

    // Clear the existing navbar content
    navbar.innerHTML = ''; 

    // If the user is authenticated, show the logout button
    if (isAuthenticated) {
        var logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.textContent = 'Logout';
        logoutLink.onclick = function() {
            alert('User logged out');

            // Redirect to the login page
            window.location.href = 'index.html';
        };
        navbar.appendChild(logoutLink);
    } 
}


// This should be triggered after the authentication status is verified
document.addEventListener('DOMContentLoaded', function() {

    // Check if user is authenticated
    var isAuthenticated = checkAuthStatus();
    updateNavbar(isAuthenticated);
});

// Placeholder for an actual authentication check function
function checkAuthStatus() {

    // Or false if the user is not authenticated
    return true;
}



document.addEventListener('DOMContentLoaded', () => {

    // Retrieve the username from local storage
    const username = localStorage.getItem('user'); 

    // display the welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (username) {

        // Set the welcome message to include the username
        welcomeMessage.textContent = `Welcome, ${username}`;
    } else {

        // Default message if no username is found
        welcomeMessage.textContent = 'Welcome, guest';
    }
});



// Function to handle querying music
function queryMusic() {

    // Retrieve the input values from the form
    var title = document.getElementById('title').value;
    var artist = document.getElementById('artist').value;
    var year = document.getElementById('year').value;

    // Construct the data payload to send
    var data = {
        title: title,
        artist: artist,
        year: year
    };

    // Define the request options for the fetch call
    var requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    // Perform the fetch call to the provided API endpoint
    fetch('https://kw0vpww8tj.execute-api.us-east-1.amazonaws.com/default/querysongs', requestOptions)
        .then(response => response.json())
        .then(data => {

            // Call the function to display the results on the page
            displayResults(data);
        })
        .catch((error) => {

            // Log errors to the console
            console.error('Error:', error);
        });
}


function displayResults(response) {
    var resultsDiv = document.getElementById('results');

    // Clear any existing content in the 'results' div
    resultsDiv.innerHTML = '';

    // Retrieve the user's email from local storage
    var userEmail = localStorage.getItem('userEmail');

    // Parse the 'body' if it's a string
    var data = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;

    // Create a table for the results if there are any
    if (data && data.length > 0) {
        var table = document.createElement('table');
        table.className = 'table';
        table.style.width = '100%';
        table.setAttribute('border', '1');

        // Create and append the header row
        var headerRow = document.createElement('tr');
        ['Title', 'Artist', 'Year', 'Actions'].forEach(text => {
            var header = document.createElement('th');
            header.textContent = text;
            headerRow.appendChild(header);
        });
        table.appendChild(headerRow);

        // Iterate through each item and add it to the table
        data.forEach(function(item) {
            var row = document.createElement('tr');
            row.appendChild(createCell(item.title));
            row.appendChild(createCell(item.artist));
            row.appendChild(createCell(item.year));

            // Actions cell with the 'Subscribe' button
            var actionsCell = document.createElement('td');
            var subscribeButton = document.createElement('button');
            subscribeButton.textContent = 'Subscribe';
            (function(song) {
                subscribeButton.addEventListener('click', function() {
                    subscribeToSong(song, userEmail);
                });
            })(item);
            actionsCell.appendChild(subscribeButton);
            row.appendChild(actionsCell);

            // Append the row to the table
            table.appendChild(row);
        });

        // Append the table to the results div
        resultsDiv.appendChild(table);
    } else {

        // Display a message if no results are found
        resultsDiv.textContent = 'No results found. Please query again.';
    }
}


function createCell(text) {
    var cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}


// Initialize an empty map or object to keep track of subscriptions
var subscriptions = {};

function addSubscription(song, justSubscribed = false) {

    if (subscriptions[song.title]) {

        // Optionally, show an alert if the user is already subscribed to the song
        alert('You are already subscribed to this song.');
        return;
    }

    // Add song to the subscription list (could be an API call or local storage update)
    subscriptions[song.title] = song;

    // Add the song to the subscriptions table
    var subscriptionsTable = document.getElementById('subscriptionsTable').getElementsByTagName('tbody')[0];
    var row = subscriptionsTable.insertRow();
    row.insertCell(0).textContent = song.title;
    row.insertCell(1).textContent = song.artist;
    row.insertCell(2).textContent = song.year;

    var removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.onclick = function() {
        removeSubscription(song.title);
    };
    row.insertCell(3).appendChild(removeButton);
}

function subscribeToSong(song, userEmail) {

    // Retrieve the user's name from local storage
    var userName = localStorage.getItem('userName');

    console.log(`Attempting to subscribe user ${userEmail} to song ${song.title}`);


    // Construct the request payload
    var requestBody = {
        email: userEmail,
        user_name: userName,
        title: song.title
    };

    // Call the API endpoint using the fetch API
    fetch('https://b4tv2c8rf0.execute-api.us-east-1.amazonaws.com/default/subscribetosong', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Include other headers your API requires
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Subscription successful:', data);
        // Update UI with the new subscription
        addSubscription(song, true);
    })
    .catch(error => {
        console.error('Subscription failed:', error);
        // Handle subscription failure, e.g., show an error message
    });
}


function getSubscribeButton(songTitle) {
    return document.querySelector(`button[data-song-title="${songTitle}"]`);
}



function removeSubscription(title) {
    var subscriptionsTable = document.getElementById('subscriptionsTable').getElementsByTagName('tbody')[0];
    for (var i = 0; i < subscriptionsTable.rows.length; i++) {
        if (subscriptionsTable.rows[i].cells[0].textContent === title) {
            subscriptionsTable.deleteRow(i);
            break;
        }
    }
    delete subscriptions[title];

    let subscribeButton = getSubscribeButton(title);
    if (subscribeButton) {
        subscribeButton.disabled = false;
        subscribeButton.classList.remove('disabled');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    var queryButton = document.querySelector('button');
    queryButton.onclick = queryMusic;
});
