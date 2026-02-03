// frontend/assets/js/auth.js
document.addEventListener('DOMContentLoaded', function() {
    const api = window.vestaAPI;
    
    // Check login status
    updateAuthUI();
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const userData = {
                name: document.getElementById('regName').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value,
                skinTone: document.getElementById('regSkinTone').value,
                bodyType: document.getElementById('regBodyType').value,
                gender: document.getElementById('regGender').value
            };
            
            try {
                const response = await api.register(userData);
                showNotification('Registration successful!', 'success');
                setTimeout(() => window.location.href = 'index.html', 1500);
            } catch (error) {
                showNotification(error.message || 'Registration failed', 'error');
            }
        });
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const credentials = {
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            };
            
            try {
                const response = await api.login(credentials);
                showNotification('Login successful!', 'success');
                setTimeout(() => window.location.href = 'index.html', 1000);
            } catch (error) {
                showNotification(error.message || 'Login failed', 'error');
            }
        });
    }
    
    // Update UI based on auth status
    function updateAuthUI() {
        const user = JSON.parse(localStorage.getItem('vesta_user') || 'null');
        const authButtons = document.getElementById('authButtons');
        const navAuthBtn = document.getElementById('navAuthBtn');
        
        if (user && authButtons) {
            authButtons.innerHTML = `
                <div class="user-dropdown">
                    <button class="user-btn">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7C3AED&color=fff" 
                             alt="${user.name}" width="32" height="32" style="border-radius: 50%;">
                        <span>${user.name.split(' ')[0]}</span>
                    </button>
                    <div class="dropdown-menu">
                        <a href="profile.html">Profile</a>
                        <a href="wardrobe.html">Wardrobe</a>
                        <a href="#" id="logoutBtn">Logout</a>
                    </div>
                </div>
            `;
            
            // Add logout event
            document.getElementById('logoutBtn')?.addEventListener('click', async function(e) {
                e.preventDefault();
                try {
                    await api.logout();
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('Logout error:', error);
                }
            });
        }
        
        if (navAuthBtn) {
            navAuthBtn.innerHTML = user ? 
                `<i class="fas fa-user"></i> ${user.name.split(' ')[0]}` :
                `<i class="fas fa-user"></i> Login`;
            navAuthBtn.href = user ? 'profile.html' : 'login.html';
        }
    }
    
    function showNotification(message, type = 'info') {
        // Simple notification
        alert(`${type.toUpperCase()}: ${message}`);
    }
});