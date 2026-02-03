// frontend/assets/js/main.js - UPDATED VERSION
class VestaApp {
    constructor() {
        this.api = window.vestaAPI;
        this.user = JSON.parse(localStorage.getItem('vesta_user') || 'null');
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.setupTheme();
        await this.setupButtonHandlers();
        await this.loadRecommendations();
        this.setupFilters();
        this.setupAnimations();
    }

    // Theme Management
    async setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const sunIcon = document.getElementById('sunIcon');
        const moonIcon = document.getElementById('moonIcon');

        if (!themeToggle) return;

        // Load saved theme
        const savedTheme = localStorage.getItem('vesta-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
            if (sunIcon) sunIcon.classList.add('hidden');
            if (moonIcon) moonIcon.classList.remove('hidden');
        }

        // Add click handler
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            
            if (sunIcon && moonIcon) {
                sunIcon.classList.toggle('hidden', isDark);
                moonIcon.classList.toggle('hidden', !isDark);
            }
            
            localStorage.setItem('vesta-theme', isDark ? 'dark' : 'light');
        });
    }

    // Button Handlers
    async setupButtonHandlers() {
        // Hero buttons
        const startStylingBtn = document.querySelector('.btn-hero');
        const exploreTrendsBtn = document.querySelector('.btn-hero-outline');

        if (startStylingBtn) {
            startStylingBtn.addEventListener('click', () => {
                window.location.href = 'register.html';
            });
        }

        if (exploreTrendsBtn) {
            exploreTrendsBtn.addEventListener('click', () => {
                window.location.href = 'explore.html';
            });
        }

        // Add ripple effect to all buttons
        document.querySelectorAll('button, .btn').forEach(button => {
            this.addRippleEffect(button);
            
            // Add hover lift effect
            if (button.classList.contains('hover-lift')) {
                button.addEventListener('mouseenter', () => {
                    button.style.transition = 'all 0.3s ease-out';
                });
            }
        });
    }

    // Ripple Effect
    addRippleEffect(button) {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    // Load Recommendations
    async loadRecommendations(filter = 'all') {
        const grid = document.getElementById('recommendationsGrid');
        if (!grid) return;

        try {
            const skinTone = this.user?.profile?.skinTone || 'medium';
            const response = await this.api.getRecommendations(skinTone, filter);
            
            if (response.data) {
                this.renderRecommendations(grid, response.data, filter);
            }
        } catch (error) {
            console.error('Failed to load recommendations:', error);
            // Fallback to mock data
            this.renderMockRecommendations(grid, filter);
        }
    }

    renderRecommendations(grid, items, filter) {
        grid.innerHTML = items
            .filter(item => filter === 'all' || item.category === filter)
            .map(item => `
                <div class="style-card hover-lift shadow-card animate-fade-up" data-category="${item.category || 'all'}">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="card-content">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                        <div class="tags">
                            ${(item.colors || []).map(color => 
                                `<span class="color-tag" style="background-color: ${color}">${color}</span>`
                            ).join('')}
                        </div>
                        <span class="category-badge">${item.category || 'general'}</span>
                    </div>
                </div>
            `).join('');
    }

    renderMockRecommendations(grid, filter) {
        const mockData = [
            {
                title: 'Weekend Casual',
                description: 'Perfect for relaxed weekends',
                image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d30?w=400&h=500&fit=crop',
                colors: ['#667eea', '#764ba2'],
                category: 'casual'
            },
            {
                title: 'Evening Glam',
                description: 'Elegant night out look',
                image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
                colors: ['#f093fb', '#f5576c'],
                category: 'party'
            },
            {
                title: 'Business Professional',
                description: 'Sharp office attire',
                image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
                colors: ['#4facfe', '#00f2fe'],
                category: 'formal'
            }
        ];

        this.renderRecommendations(grid, mockData, filter);
    }

    // Filter Setup
    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active to clicked button
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                this.currentFilter = filter;
                this.loadRecommendations(filter);
            });
        });
    }

    // Animations
    setupAnimations() {
        // Add animations to elements as they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-up');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements
        document.querySelectorAll('.feature-card, .style-card, .outfit-preview').forEach(el => {
            observer.observe(el);
        });

        // Hero animation
        setTimeout(() => {
            const hero = document.querySelector('.hero-content');
            if (hero) {
                hero.classList.add('animate-fade-in');
            }
        }, 100);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const app = new VestaApp();
    
    // Expose app to window for debugging
    window.vestaApp = app;
});