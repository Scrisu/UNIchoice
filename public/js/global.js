window.onload = function() {
    fetch('activity_bar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            checkUserStatus();
            attachEventListeners();
        })
        .catch(error => console.error('Error loading header:', error));

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
};

const checkUserStatus = () => {
    console.log("Checking user status...");
    fetch('/user/status', {
        method: 'GET',
        credentials: 'include'
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

            if (signInButton) {
                signInButton.style.display = 'none';
            }

            if (logoutButton) {
                logoutButton.style.display = 'block';
            }
            if (avatarButton) {
                avatarButton.style.display = 'block';
            }

            if (profileButton) {
                profileButton.textContent = `Hello, ${data.username}`;
                profileButton.style.display = 'inline-block';
                console.log(`Profile button updated with username: ${data.username}`);
            }
        } else {
            console.log("User is not logged in");

            if (signInButton) {
                signInButton.style.display = 'block';
            }

            if (logoutButton) {
                logoutButton.style.display = 'none';
            }

            if (profileButton) {
                profileButton.textContent = 'Profil';
                profileButton.style.display = 'block';
            }
        }
    })
    .catch(error => {
        console.error('Error fetching user status:', error);

        const signInButton = document.getElementById('sign-in-btn');
        const logoutButton = document.getElementById('logout-btn');
        const avatarButton = document.getElementById('avatar-div');
        const profileButton = document.querySelector('.profile-button');

        if (signInButton) signInButton.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'none';
        if (profileButton) profileButton.style.display = 'block';
        if (avatarButton) avatarButton.style.display = 'block';
    });
};

const attachEventListeners = () => {
    const signInButton = document.getElementById('sign-in-btn');
    if (signInButton) {
        console.log('Sign In button found. Attaching click listener...');
        signInButton.addEventListener('click', () => {
            window.location.href = '/auth';
        });
    } else {
        console.error('Sign In button not found.');
    }

    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        console.log('Logout button found. Attaching click listener...');
        logoutButton.addEventListener('click', () => {
            console.log('Logout button clicked');
            fetch('/logout', {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => {
                if (response.ok) {
                    console.log('User logged out successfully');
                    window.location.href = '/';
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
