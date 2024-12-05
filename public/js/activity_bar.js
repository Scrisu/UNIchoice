document.addEventListener('DOMContentLoaded', () => {
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
            const avatarButton = document.getElementById('avatar-div');
            const profileButton = document.querySelector('.profile-button');

            if (data.loggedIn) {
                console.log("User is logged in");

                // Hide "Sign In" button
                if (signInButton) {
                    signInButton.style.display = 'none';
                } else {
                    console.error('Sign In button not found.');
                }

                // Show "Log Out" button
                if (logoutButton) {
                    logoutButton.style.display = 'block';
                } else {
                    console.error('Log Out button not found.');
                }

                // Update Profile button to display username
                if (profileButton) {
                    profileButton.textContent = `Hello, ${data.username}`;
                    profileButton.style.display = 'block'; // Ensure the profile button is visible
                    console.log(`Profile button updated with username: ${data.username}`);
                } else {
                    console.error('Profile button not found.');
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
                if (avatarButton) {
                    avatarButton.style.display = 'block';
                }
                // Hide Profile button
                if (profileButton) {
                    profileButton.style.display = 'none';
                }
            }
        })
        .catch(error => {
            console.error('Error fetching user status:', error);

            // Fallback to make sure elements are appropriately displayed in case of an error
            const signInButton = document.getElementById('sign-in-btn');
            const logoutButton = document.getElementById('logout-btn');
            const avatarButton = document.getElementById('avatar-div');
            const profileButton = document.querySelector('.profile-button');

            if (signInButton) signInButton.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'none';
            if (avatarButton) avatarButton.style.display = 'block';
            if (profileButton) profileButton.style.display = 'none';
        });
    };

    // Function to handle user login
    const handleLogin = () => {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            console.log('Login form found. Attaching submit event listener...');
            loginForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Prevent default form submission
                console.log('Login form submitted');

                // Collect email and password values from form
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                // Send login data to server using POST request
                fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include' // Include cookies for session
                })
                .then(response => {
                    console.log('Login response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`Server returned ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Login response data:', data);
                    if (data.loggedIn) {
                        console.log('Redirecting to home page...');
                        window.location.href = '/home'; // Redirect after successful login
                    } else {
                        console.error('Login failed:', data.error);
                        alert(data.error || 'Login failed. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Login error (catch block):', error);
                    alert('An error occurred during login. Please try again.');
                });
            });
        } else {
            console.error('Login form not found.');
        }
    };

    // Function to handle user logout
    const handleLogout = () => {
        const logoutButton = document.getElementById('logout-btn');
        if (logoutButton) {
            console.log('Logout button found. Attaching event listener...');
            logoutButton.addEventListener('click', () => {
                console.log('Logout button clicked');
                fetch('/logout', {
                    method: 'GET',
                    credentials: 'include' // Include cookies to destroy the session properly
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
    const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

    // Run these functions on page load to set up event listeners and check user status
    checkUserStatus();
    handleLogin(); // Attach event listener to login form
    handleLogout(); // Attach event listener to logout button
});

