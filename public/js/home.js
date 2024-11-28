window.onload = function() {
    // Load header and footer placeholders
    fetch('activity_bar.html')
        .then(response => response.text())
        .then(data => {
            // Insert header HTML into the placeholder
            document.getElementById('header-placeholder').innerHTML = data;

            // Run user status check AFTER the header is loaded
            checkUserStatus(); 
            attachEventListeners(); // Attach event listeners for sign-in and logout
        })
        .catch(error => console.error('Error loading header:', error));

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
};

// Function to check the user's login status and update UI accordingly
const checkUserStatus = () => {
    console.log("Checking user status...");
    fetch('/user/status', {
        method: 'GET',
        credentials: 'include' // Include cookies for session
    })
    .then(response => response.json())
    .then(data => {
        console.log("User status response:", data);

        const signInButton = document.getElementById('sign-in-btn');
        const logoutButton = document.getElementById('logout-btn');
        const profileButton = document.querySelector('.profile-button');

        if (data.loggedIn) {
            console.log("User is logged in");

            // Hide "Sign In" button
            if (signInButton) {
                signInButton.style.display = 'none';
            }

            // Show "Log Out" button
            if (logoutButton) {
                logoutButton.style.display = 'block';
            }

            // Update Profile button to display username
            if (profileButton) {
                profileButton.textContent = `Hello, ${data.username}`;
                profileButton.style.display = 'inline-block'; // Ensure the profile button is visible
                console.log(`Profile button updated with username: ${data.username}`);
            }
        } else {
            console.log("User is not logged in");

            // Show "Sign In" button
            if (signInButton) {
                signInButton.style.display = 'block';
            }

            // Hide "Log Out" button
            if (logoutButton) {
                logoutButton.style.display = 'none';
            }

            // Hide Profile button
            if (profileButton) {
                profileButton.textContent = 'Profil';
                profileButton.style.display = 'block'; // Keep it visible but with default text
            }
        }
    })
    .catch(error => {
        console.error('Error fetching user status:', error);

        // Fallback to make sure elements are appropriately displayed in case of an error
        const signInButton = document.getElementById('sign-in-btn');
        const logoutButton = document.getElementById('logout-btn');
        const profileButton = document.querySelector('.profile-button');

        if (signInButton) signInButton.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
        if (profileButton) profileButton.style.display = 'block';
    });
};

// Function to attach necessary event listeners to buttons
const attachEventListeners = () => {
    // Attach listener for Sign In button
    const signInButton = document.getElementById('sign-in-btn');
    if (signInButton) {
        console.log('Sign In button found. Attaching click listener...');
        signInButton.addEventListener('click', () => {
            window.location.href = '/auth';
        });
    } else {
        console.error('Sign In button not found.');
    }

    // Attach listener for Logout button
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        console.log('Logout button found. Attaching click listener...');
        logoutButton.addEventListener('click', () => {
            console.log('Logout button clicked');
            fetch('/logout', {
                method: 'GET',
                credentials: 'include' // Include cookies for session
            })
            .then(response => {
                if (response.ok) {
                    console.log('User logged out successfully');
                    window.location.href = '/'; // Redirect to the home page after logout
                } else {
                    console.error('Failed to log out');
                }
            })
            .catch(error => console.error('Error during logout:', error));
        });
    } else {
        console.error('Logout button not found.');
    }
};