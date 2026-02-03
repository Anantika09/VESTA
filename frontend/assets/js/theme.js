// assets/js/theme.js - Simple theme management
(function() {
    'use strict';
    
    const ThemeManager = {
        init() {
            this.setupThemeToggle();
            this.loadTheme();
        },
        
        loadTheme() {
            const savedTheme = localStorage.getItem('vesta-theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.body.classList.add('dark-mode');
                this.updateIcons(true);
            }
        },
        
        setupThemeToggle() {
            const toggleBtn = document.getElementById('themeToggle');
            if (!toggleBtn) return;
            
            toggleBtn.addEventListener('click', () => {
                const isDark = document.body.classList.toggle('dark-mode');
                this.updateIcons(isDark);
                localStorage.setItem('vesta-theme', isDark ? 'dark' : 'light');
            });
        },
        
        updateIcons(isDark) {
            const sunIcon = document.getElementById('sunIcon');
            const moonIcon = document.getElementById('moonIcon');
            
            if (sunIcon && moonIcon) {
                sunIcon.classList.toggle('hidden', isDark);
                moonIcon.classList.toggle('hidden', !isDark);
            }
        }
    };
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
    } else {
        ThemeManager.init();
    }
})();