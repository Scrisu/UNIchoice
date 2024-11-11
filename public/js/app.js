document.addEventListener('DOMContentLoaded', () => {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    
    // Comută între formulare
    loginTab.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
        loginTab.classList.add('active-tab');
        registerTab.classList.remove('active-tab');
    });

    registerTab.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
        registerTab.classList.add('active-tab');
        loginTab.classList.remove('active-tab');
    });

    // Înregistrare utilizator
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                alert('Înregistrare reușită! Acum te poți autentifica.');
                loginTab.click();
            } else {
                const data = await response.json();
                alert(`Eroare: ${data.error}`);
            }
        } catch (error) {
            console.error('Eroare:', error);
        }
    });

    // Autentificare utilizator
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Autentificare reușită!');
                localStorage.setItem('token', data.token); // Stochează token-ul pentru acces viitor
                // Poți redirecționa utilizatorul către pagina principală, de exemplu:
                window.location.href = '/dashboard';
            } else {
                const data = await response.json();
                alert(`Eroare: ${data.error}`);
            }
        } catch (error) {
            console.error('Eroare:', error);
        }
    });<script>
   
</script>


 

});


