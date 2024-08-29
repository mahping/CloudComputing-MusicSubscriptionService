document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get values from form inputs
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Prepare the data to be sent in the POST request
    var data = {
        email: email,
        password: password
    };

    // API endpoint
    var url = "https://oycc1s3jf2.execute-api.us-east-1.amazonaws.com/default/loginuser";

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
        if (data.statusCode === 200) {
            alert('Login successful');
            localStorage.setItem("user", data.body.username);
            localStorage.setItem("userEmail", document.getElementById("email").value);

            // Redirect to main page 
            window.location.href = 'main.html';
        } else {

             // Error message
            alert(data.body); 
        }
    })
    .catch((error) => {

        // Handle Errors
        console.error('Error:', error);
        alert("Login request failed.");

    });

});
