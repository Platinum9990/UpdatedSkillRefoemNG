document.addEventListener('DOMContentLoaded', function() {
    // --- Form Toggling Logic ---
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');

    const toggleForms = () => {
        loginContainer.classList.toggle('hidden');
        registerContainer.classList.toggle('hidden');
    };

    if (showRegisterLink && showLoginLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleForms();
        });
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleForms();
        });
    }

    // --- Backend Form Submission Logic ---
    const apiBase = "http://localhost:5000/api/auth"; // Your backend server address

    // Login Form Submission
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const form = e.target;
            const email = form.email.value;
            const password = form.password.value;

            try {
                const res = await fetch(`${apiBase}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();
                
                if (!res.ok) {
                    throw new Error(data.message || "Login failed");
                }

                alert("Login successful!");
                // sessionStorage.setItem("token", data.token);
                // window.location.href = "/dashboard.html";

            } catch (err) {
                console.error("Login error:", err);
                alert(err.message || "An error occurred during login.");
            }
        });
    }

    // Registration Form Submission
    const registerForm = document.getElementById("register-form");
    if(registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const form = e.target;
            const fullName = form.name.value;
            const email = form.email.value;
            const password = form.password.value;
            const role = form.role.value;

            try {
                const res = await fetch(`${apiBase}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fullName, email, password, role }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Registration failed");
                }
                
                // --- THIS IS THE UPDATED SUCCESS LOGIC ---
                const successMessage = document.getElementById('registration-success-message');
                if (successMessage) {
                    // Show the success message and hide the form for a clean UI
                    successMessage.classList.remove('hidden');
                    registerForm.classList.add('hidden');

                    // Automatically switch back to the login form after 3 seconds
                    setTimeout(() => {
                        toggleForms();
                        // Reset the form for the next time
                        successMessage.classList.add('hidden');
                        registerForm.classList.remove('hidden');
                        form.reset();
                    }, 3000);
                } else {
                    // Fallback if the success message element doesn't exist
                    alert("Registration successful! Please check your email to verify.");
                    toggleForms();
                }
                // --- END OF UPDATE ---

            } catch (err) {
                console.error("Register error:", err);
                alert(err.message || "An error occurred during registration.");
            }
        });
    }
});