
// =====================================
// RESQ CONNECT - AUTHENTICATION SYSTEM
// =====================================

// Dashboard links for each role
const dashboards = {
    "user": "userdashboard.html",
    "coordinator": "coordinator-dash.html",
    "rescue-team": "rescue-team-dash.html"
};


// =====================================
// REGISTER NEW ACCOUNT
// =====================================

function registerUser(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !role) {
        alert("Please fill in all the fields.");
        return;
    }

    if (password.length < 8 || password.length > 15) {
        alert("Password must be between 8 and 15 characters.");
        return;
    }

    if (!dashboards[role]) {
        alert("Please select a valid role.");
        return;
    }

    // Get existing registered accounts
    let accounts = JSON.parse(localStorage.getItem("resqAccounts")) || [];

    // Check if email already exists
    let existingAccount = accounts.find(function(account) {
        return account.email === email;
    });

    if (existingAccount) {
        alert("This email is already registered. Please log in.");
        return;
    }

    // Create new account
    let newAccount = {
        name: name,
        email: email,
        password: password,
        role: role
    };

    accounts.push(newAccount);

    // Save accounts in browser storage
    localStorage.setItem("resqAccounts", JSON.stringify(accounts));

    alert("Registration successful! Please log in.");

    window.location.href = "Login.html";
}


// =====================================
// LOGIN EXISTING ACCOUNT
// =====================================

function loginUser(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    // Get registered accounts
    let accounts = JSON.parse(localStorage.getItem("resqAccounts")) || [];

    // Find matching account
    let account = accounts.find(function(user) {
        return user.email === email && user.password === password;
    });

    if (!account) {
        alert("Invalid email or password.");
        return;
    }

    // Save currently logged-in account
    sessionStorage.setItem("resqLoggedInUser", JSON.stringify({
        name: account.name,
        email: account.email,
        role: account.role
    }));

    alert("Login successful! Welcome " + account.name);

    // Redirect according to saved role
    window.location.href = dashboards[account.role];
}


// =====================================
// CHECK LOGIN AND ROLE ON DASHBOARD
// =====================================

function checkLogin(requiredRole) {

    let loggedInUser = JSON.parse(
        sessionStorage.getItem("resqLoggedInUser")
    );

    if (!loggedInUser) {
        alert("Please log in first.");
        window.location.href = "Login.html";
        return;
    }

    if (loggedInUser.role !== requiredRole) {
        alert("You are not authorised to access this dashboard.");

        window.location.href = dashboards[loggedInUser.role] || "Login.html";
        return;
    }

    // Display logged-in person's name if an element exists
    let welcomeElement = document.getElementById("loggedInName");

    if (welcomeElement) {
        welcomeElement.innerText = loggedInUser.name;
    }
}


// =====================================
// LOGOUT
// =====================================

function logoutUser() {

    sessionStorage.removeItem("resqLoggedInUser");

    alert("You have been logged out.");

    window.location.href = "Login.html";
}
