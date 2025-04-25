// UI helper functions for authentication screens
const UI = {
    // Show/hide elements
    showElement: function(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = '';
        }
    },
    
    hideElement: function(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    },
    
    // Toggle between login and signup modes
    toggleAuthMode: function(mode) {
        const loginForm = document.querySelector('.login-form');
        const welcomeGreeting = document.querySelector('.welcome-greeting');
        
        if (mode === 'signup') {
            // Change to signup mode
            welcomeGreeting.innerHTML = 'Create Account';
            document.querySelector('.login-btn').textContent = 'Sign Up';
            document.querySelector('.signup-link').textContent = 'Back to Login';
            document.querySelector('.signup-link').dataset.mode = 'login';
        } else {
            // Change to login mode
            welcomeGreeting.innerHTML = 'Welcome Back, <span class="user-name">Explorer</span>';
            document.querySelector('.login-btn').textContent = 'Sign In';
            document.querySelector('.signup-link').textContent = 'Create Account';
            document.querySelector('.signup-link').dataset.mode = 'signup';
        }
    },
    
    // Display notification message
    showNotification: function(message, isError = false) {
        // Check if notification exists
        let notification = document.querySelector('.auth-notification');
        
        // Create if it doesn't exist
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'auth-notification';
            document.querySelector('.login-form').prepend(notification);
        }
        
        // Set message and style
        notification.textContent = message;
        notification.className = `auth-notification ${isError ? 'error' : 'success'}`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    },
    
    // Update UI based on login state
    updateUIForUser: function(user) {
        // Hide login form
        this.hideElement('.login-form');
        
        // Update greeting to show username
        const welcomeGreeting = document.querySelector('.welcome-greeting');
        welcomeGreeting.innerHTML = `Welcome, <span class="user-name">${user.username}</span>`;
        
        // Add account controls
        const welcomeContent = document.querySelector('.welcome-content');
        
        // Check if controls already exist
        if (!document.querySelector('.user-controls')) {
            const userControls = document.createElement('div');
            userControls.className = 'user-controls';
            userControls.innerHTML = `
                <div class="user-stats">
                    <div class="user-stat">
                        <span class="stat-label">Member since</span>
                        <span class="stat-value">${new Date(user.created).toLocaleDateString()}</span>
                    </div>
                </div>
                <button class="logout-btn">Sign Out</button>
            `;
            welcomeContent.appendChild(userControls);
            
            // Add event listener to logout button
            document.querySelector('.logout-btn').addEventListener('click', () => {
                AUTH.logout();
                this.updateUIForLoggedOut();
            });
        }
        
        // Update quiz stats if they exist
        this.updateQuizStats(user.quizProgress);
    },
    
    // Reset UI when logged out
    updateUIForLoggedOut: function() {
        // Show login form
        this.showElement('.login-form');
        
        // Reset greeting
        const welcomeGreeting = document.querySelector('.welcome-greeting');
        welcomeGreeting.innerHTML = 'Welcome Back, <span class="user-name">Explorer</span>';
        
        // Remove user controls if they exist
        const userControls = document.querySelector('.user-controls');
        if (userControls) {
            userControls.remove();
        }
        
        // Reset form fields
        document.querySelector('input[placeholder="Username"]').value = '';
        document.querySelector('input[placeholder="Password"]').value = '';
        
        // Reset quiz stats to defaults
        this.updateQuizStats({
            overall: 0,
            categories: {
                ancient: 0,
                medieval: 0,
                modern: 0,
                future: 0
            },
            questionsAttempted: 0,
            questionsCorrect: 0,
            accuracy: 0
        });
    },
    
    // Update the quiz stats display
    updateQuizStats: function(progress) {
        // Update progress if quiz stats box exists
        const quizStatsBox = document.querySelector('.quiz-stats-box');
        if (!quizStatsBox) return;
        
        // Update pie chart
        const pieChart = document.querySelector('.pie-chart');
        if (pieChart) {
            pieChart.style.background = `conic-gradient(var(--gold) 0% ${progress.overall}%, rgba(212, 175, 55, 0.2) ${progress.overall}% 100%)`;
            document.querySelector('.pie-chart-center').textContent = `${progress.overall}%`;
        }
        
        // Update bar chart
        const bars = document.querySelectorAll('.bar');
        if (bars.length > 0) {
            // Ancient
            bars[0].style.height = `${progress.categories.ancient}%`;
            bars[0].querySelector('.bar-value').textContent = `${progress.categories.ancient}%`;
            
            // Medieval
            bars[1].style.height = `${progress.categories.medieval}%`;
            bars[1].querySelector('.bar-value').textContent = `${progress.categories.medieval}%`;
            
            // Modern
            bars[2].style.height = `${progress.categories.modern}%`;
            bars[2].querySelector('.bar-value').textContent = `${progress.categories.modern}%`;
            
            // Future
            bars[3].style.height = `${progress.categories.future}%`;
            bars[3].querySelector('.bar-value').textContent = `${progress.categories.future}%`;
        }
        
        // Update quick stats
        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 3) {
            statValues[0].textContent = progress.questionsAttempted;
            statValues[1].textContent = progress.questionsCorrect;
            statValues[2].textContent = `${progress.accuracy}%`;
        }
    }
}; 