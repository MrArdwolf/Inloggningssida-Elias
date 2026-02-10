

const body = document.body;
const loginPage = document.getElementById('login-page');
const homepage = document.createElement('div');
homepage.classList.add('login-page');

const registerPage = document.createElement('div');
registerPage.classList.add('login-page');
registerPage.id = 'register-page';

const credError = document.createElement('p');

const users = JSON.parse(localStorage.getItem('users'));

if (document.getElementById('login-page')) {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');

    const registerLink = document.getElementById('register-link');
    registerLink.addEventListener('click', function (event) {
        event.preventDefault();
        showRegisterPage();
    });

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            credError.textContent = 'Vänligen fyll i både användarnamn och lösenord.';
            credError.style.color = 'red';
            loginForm.appendChild(credError);
            return;
        }

        if (!users) {
            credError.textContent = 'Inga användare registrerade. Vänligen registrera ett konto först.';
            credError.style.color = 'red';
            loginForm.appendChild(credError);
            return;
        }

        const user = users.find(user => user.username === username);

        if (!user) {
            credError.textContent = 'Användaren finns inte. Försök igen.';
            credError.style.color = 'red';
            loginForm.appendChild(credError);
            return;
        }

        if (user.password !== password) {
            credError.textContent = 'Felaktigt lösenord. Försök igen.';
            credError.style.color = 'red';
            loginForm.appendChild(credError);
            return;
        }

        if (username === user.username && password === user.password) {
            localStorage.setItem('username', username);
            usernameInput.value = '';
            passwordInput.value = '';
            showHomePage();
        } else {
            alert('Felaktigt användarnamn eller lösenord. Försök igen.');
        }
    });
}

if (localStorage.getItem('username')) {
    showHomePage();
}

function showHomePage() {
    const storedUsername = localStorage.getItem('username');


    if (storedUsername) {
        const usernameElement = document.createElement('span');
        usernameElement.textContent = storedUsername;
        homepage.innerHTML = `
            <h1>Välkommen till hemsidan!</h1>
            <p>${storedUsername} du är nu inloggad.</p>
            <button class="primary-button" id="logout-button">Logga ut</button>
        `;
        body.replaceChild(homepage, loginPage);
        document.getElementById('logout-button').addEventListener('click', logout);
    }
}

function logout() {
    localStorage.removeItem('username');
    body.replaceChild(loginPage, homepage);
}

function showRegisterPage() {
    registerPage.innerHTML = `
            <div class="title-row">
                <h1>Registrera</h1>
                <p>Har du redan konto? <a class="link-button" id="login-link">Logga in</a></p>
            </div>
            <form id="register-form">
                <div class="inputs">
                    <div class="input-row">
                        <label for="username">Användarnamn:</label>
                        <input class="input-text" type="text" name="username" id="username-input" autocomplete="username" placeholder="Användarnamn" required>
                    </div>
                    <div class="input-row">
                        <label for="password">Lösenord:</label>
                        <input class="input-text" type="password" name="password" id="password-input" placeholder="Lösenord" autocomplete="current-password" required>
                    </div>
                    <div class="input-row">
                        <label for="confirm-password">Bekräfta lösenord:</label>
                        <input class="input-text" type="password" name="confirm-password" id="confirm-password-input" placeholder="Bekräfta lösenord" autocomplete="new-password" required>
                    </div>
                </div>

                <button class="primary-button submit-button" type="submit">Registrera</button>
            </form>`
    body.replaceChild(registerPage, loginPage);
    document.getElementById('login-link').addEventListener('click', function (event) {
        event.preventDefault();
        body.replaceChild(loginPage, registerPage);
    });

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const usernameInputReg = document.getElementById('username-input');
        const passwordInputReg = document.getElementById('password-input');
        const confirmPasswordInput = document.getElementById('confirm-password-input');

        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const username = usernameInputReg.value.trim();
            const password = passwordInputReg.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!username || !password || !confirmPassword) {
                credError.textContent = 'Vänligen fyll i alla fält.';
                credError.style.color = 'red';
                registerForm.appendChild(credError);
                return;
            }

            if (password !== confirmPassword) {
                credError.textContent = 'Lösenorden matchar inte. Försök igen.';
                credError.style.color = 'red';
                registerForm.appendChild(credError);
                return;
            }

            const existingUser = users.find(user => user.username === username);

            if (existingUser) {
                credError.textContent = 'Användarnamnet är redan taget. Vänligen välj ett annat.';
                credError.style.color = 'red';
                registerForm.appendChild(credError);
                return;
            }

            users.push({ username: username, password: password });
            localStorage.setItem('users', JSON.stringify(users));
            body.replaceChild(loginPage, registerPage);
            
            alert('Registrering lyckades! Du kan nu logga in med dina uppgifter.');
        });
    }
}