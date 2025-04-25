// User authentication and storage functions
const AUTH = {
    // Check if a user is currently logged in
    isLoggedIn: function() {
        return localStorage.getItem('currentUser') !== null;
    },

    // Get the current logged in user
    getCurrentUser: function() {
        const userJson = localStorage.getItem('currentUser');
        return userJson ? JSON.parse(userJson) : null;
    },

    // Register a new user
    register: function(username, password) {
        // Check if users database exists
        let users = localStorage.getItem('users');
        users = users ? JSON.parse(users) : {};
        
        // Check if username already exists
        if (users[username]) {
            return {
                success: false,
                message: 'Username already exists'
            };
        }
        
        // Create user object with initial quiz progress
        const newUser = {
            username: username,
            password: password, // In a real app, this should be hashed
            created: new Date().toISOString(),
            quizProgress: {
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
            },
            history: []
        };
        
        // Add to users database
        users[username] = newUser;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Return success without the password
        const userResponse = {...newUser};
        delete userResponse.password;
        return {
            success: true,
            message: 'Registration successful',
            user: userResponse
        };
    },

    // Login user
    login: function(username, password) {
        // Check if users database exists
        let users = localStorage.getItem('users');
        if (!users) {
            return {
                success: false,
                message: 'Invalid credentials'
            };
        }
        
        users = JSON.parse(users);
        
        // Check if user exists and password matches
        if (!users[username] || users[username].password !== password) {
            return {
                success: false,
                message: 'Invalid credentials'
            };
        }
        
        // Set current user in localStorage
        const userResponse = {...users[username]};
        delete userResponse.password;
        localStorage.setItem('currentUser', JSON.stringify(userResponse));
        
        return {
            success: true,
            message: 'Login successful',
            user: userResponse
        };
    },

    // Logout user
    logout: function() {
        localStorage.removeItem('currentUser');
        return {
            success: true,
            message: 'Logout successful'
        };
    },

    // Update user quiz progress
    updateQuizProgress: function(progressData) {
        if (!this.isLoggedIn()) {
            return {
                success: false,
                message: 'User not logged in'
            };
        }
        
        const currentUser = this.getCurrentUser();
        let users = JSON.parse(localStorage.getItem('users'));
        
        // Update quiz progress
        users[currentUser.username].quizProgress = {
            ...users[currentUser.username].quizProgress,
            ...progressData
        };
        
        // Add to history if provided
        if (progressData.historyEntry) {
            users[currentUser.username].history.push({
                ...progressData.historyEntry,
                date: new Date().toISOString()
            });
        }
        
        // Update localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user
        const updatedUser = {...users[currentUser.username]};
        delete updatedUser.password;
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        return {
            success: true,
            message: 'Progress updated',
            user: updatedUser
        };
    }
}; 