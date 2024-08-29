

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('Register');
    form.addEventListener('submit', handleSubmit);
});

function handleSubmit(event) {
    event.preventDefault(); 

    // Get values from form inputs
    var email = document.getElementById('email').value;
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Prepare the data to be sent in the POST request
    var data = {
        email: email,
        username: username,
        password: password
    };

    // API endpoint
    var url = "https://o7noniilp2.execute-api.us-east-1.amazonaws.com/default/registeruser";

    // Send the POST request using fetch
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        // Convert the JavaScript object to a JSON string
        body: JSON.stringify(data)
    })

    // Parse JSON response into native JavaScript objects
    .then(response => response.json())
    .then(data => {

        // Response data
        alert(data.body);
        if (data.body === 'Registration successful') {

            // Redirect to the login page
            window.location.href = 'login.html';
        }
    })
    .catch((error) => {

        // Handle Errors
        console.error('Error:', error);
        alert("Failed to register user.");
    });
}
