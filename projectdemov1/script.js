// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Create stars in the background
function createStars() {
    const starsContainer = document.getElementById('stars-container');
    
    // Clear any existing stars
    starsContainer.innerHTML = '';
    
    // Create stars
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        // Random size (0.5px to 3px)
        const size = Math.random() * 2.5 + 0.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random opacity and animation delay
        star.style.opacity = Math.random();
        star.style.animationDelay = `${Math.random() * 5}s`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        
        starsContainer.appendChild(star);
    }
}

// Initialize authentication
function initAuth() {
    // Add event listener to login button
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form values
            const usernameInput = document.querySelector('input[placeholder="Username"]');
            const passwordInput = document.querySelector('input[placeholder="Password"]');
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Basic validation
            if (!username || !password) {
                UI.showNotification('Please enter both username and password', true);
                return;
            }
            
            // Check if we're in signup or login mode
            const isSignup = loginBtn.textContent === 'Sign Up';
            
            if (isSignup) {
                // Register new user
                const result = AUTH.register(username, password);
                
                if (result.success) {
                    UI.showNotification('Account created successfully!');
                    
                    // Auto login
                    const loginResult = AUTH.login(username, password);
                    UI.updateUIForUser(loginResult.user);
                } else {
                    UI.showNotification(result.message, true);
                }
            } else {
                // Login existing user
                const result = AUTH.login(username, password);
                
                if (result.success) {
                    UI.showNotification('Login successful!');
                    UI.updateUIForUser(result.user);
                } else {
                    UI.showNotification(result.message, true);
                }
            }
        });
    }
    
    // Add event listener to signup/login toggle link
    const signupLink = document.querySelector('.signup-link');
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle between signup and login modes
            const mode = this.dataset.mode || 'signup';
            UI.toggleAuthMode(mode);
            
            // Update data mode for next click
            this.dataset.mode = mode === 'signup' ? 'login' : 'signup';
        });
    }
    
    // Check if user is already logged in
    if (AUTH.isLoggedIn()) {
        const user = AUTH.getCurrentUser();
        UI.updateUIForUser(user);
    }
}

// Initialize animations on load
document.addEventListener('DOMContentLoaded', function() {
    // Create floating background elements dynamically
    const bgElements = document.querySelector('.bg-elements');
    for (let i = 0; i < 10; i++) {
        const element = document.createElement('div');
        element.className = 'bg-element';
        element.style.width = `${Math.random() * 200 + 100}px`;
        element.style.height = element.style.width;
        element.style.top = `${Math.random() * 100}%`;
        element.style.left = `${Math.random() * 100}%`;
        element.style.animationDelay = `${Math.random() * 15}s`;
        element.style.animationDuration = `${Math.random() * 20 + 10}s`;
        bgElements.appendChild(element);
    }
    
    // Create stars
    createStars();
    
    // Initialize authentication
    initAuth();
});