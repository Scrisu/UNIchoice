function isLoggedIn() {
    // This should ideally check from a backend session or a cookie
    // For now, let's assume a variable that simulates login status
    return Boolean(localStorage.getItem('loggedIn')); // Replace with actual authentication logic
  }

  // Function to render buttons based on login status
  function renderAuthButtons() {
    const authSection = document.getElementById('auth-section');
    authSection.innerHTML = ''; // Clear any existing content

    if (isLoggedIn()) {
      // If logged in, show Profile button and dropdown menu
      authSection.innerHTML = `
        <div class="dropdown">
          <a href="#detalii_utilizator" class="profile-button dropdown-btn">Profil</a>
          <div class="dropdown-content">
            <a href="detalii_utilizator.html">Contul Meu</a>
            <a href="universitatile_mele.html">Universitățile mele</a>
            <a href="evenimente_importante.html">Evenimente importante</a>
            <a href="#" onclick="logout()">Log Out</a>
          </div>
        </div>
        <img src="images/account.png" alt="Avatar" class="avatar-icon">
      `;
    } else {
      // If not logged in, show Log In button
      authSection.innerHTML = `
        <a href="login.html" class="login-button">Log In</a>
      `;
    }
  }

  // Function to simulate a logout action
  function logout() {
    localStorage.removeItem('loggedIn'); // Clear login status (for this example)
    renderAuthButtons(); // Re-render buttons to show Log In button
  }

  // Initialize the buttons on page load
  renderAuthButtons();