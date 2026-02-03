// ===== VESTA Application - Main JavaScript =====
// MERN Stack Project - Personal AI Styling Assistant

class VestaApp {
    constructor() {
        this.init();
        this.currentUser = null;
        this.wardrobeItems = [];
        this.recommendations = [];
        this.events = [];
        this.initEventListeners();
        this.loadUserData();
    }

    // ===== INITIALIZATION =====
    init() {
        // Hide loader after 1.5 seconds
        setTimeout(() => {
            document.querySelector('.loader')?.classList.add('hidden');
            this.animateOnScroll();
        }, 1500);

        // Initialize tooltips
        this.initTooltips();
        
        // Initialize image lazy loading
        this.initLazyLoading();
        
        // Initialize wardrobe if on wardrobe page
        if (window.location.pathname.includes('wardrobe.html')) {
            this.initWardrobe();
        }
        
        // Initialize recommendations if on recommendations page
        if (window.location.pathname.includes('recommendations.html')) {
            this.initRecommendations();
        }
        
        // Initialize inspiration search if on inspiration page
        if (window.location.pathname.includes('inspiration.html')) {
            this.initInspirationSearch();
        }
        
        // Initialize events if on events page
        if (window.location.pathname.includes('events.html')) {
            this.initEvents();
        }
        
        // Initialize profile if on profile page
        if (window.location.pathname.includes('profile.html')) {
            this.initProfile();
        }
    }

    // ===== USER MANAGEMENT =====
    loadUserData() {
        // Simulate API call to load user data
        setTimeout(() => {
            this.currentUser = {
                id: 1,
                name: "Anantika",
                email: "anantika@example.com",
                skinTone: "Medium",
                bodyType: "Hourglass",
                gender: "Female",
                preferences: {
                    style: ["Bohemian", "Minimalist"],
                    colors: ["Purple", "Black", "White"],
                    brands: ["Zara", "H&M"]
                },
                joinedDate: "2024-01-15"
            };
            
            // Update profile info if profile page exists
            this.updateProfileInfo();
            
            console.log("User data loaded:", this.currentUser);
        }, 500);
    }

    updateProfileInfo() {
        if (!this.currentUser) return;
        
        // Update profile name in navigation
        const profileName = document.querySelector('.profile-toggle span');
        if (profileName) {
            profileName.textContent = this.currentUser.name;
        }
        
        // Update profile page if exists
        const profilePage = document.getElementById('profilePage');
        if (profilePage) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userEmail').textContent = this.currentUser.email;
            document.getElementById('skinTone').textContent = this.currentUser.skinTone;
            document.getElementById('bodyType').textContent = this.currentUser.bodyType;
            document.getElementById('gender').textContent = this.currentUser.gender;
            document.getElementById('joinDate').textContent = new Date(this.currentUser.joinedDate).toLocaleDateString();
            
            // Update preferences
            const preferencesList = document.getElementById('userPreferences');
            if (preferencesList) {
                preferencesList.innerHTML = this.currentUser.preferences.style
                    .map(pref => `<span class="preference-tag">${pref}</span>`)
                    .join('');
            }
        }
    }

    // ===== WARDROBE MANAGEMENT =====
    initWardrobe() {
        // Load sample wardrobe items
        this.wardrobeItems = [
            {
                id: 1,
                name: "Black Leather Jacket",
                type: "clothing",
                category: "outerwear",
                color: "#000000",
                image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400",
                dateAdded: "2024-02-15",
                tags: ["Casual", "Edgy", "Versatile"]
            },
            {
                id: 2,
                name: "White Silk Blouse",
                type: "clothing",
                category: "top",
                color: "#FFFFFF",
                image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=400",
                dateAdded: "2024-02-10",
                tags: ["Formal", "Elegant", "Office"]
            },
            {
                id: 3,
                name: "Blue Denim Jeans",
                type: "clothing",
                category: "bottom",
                color: "#0000FF",
                image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400",
                dateAdded: "2024-02-05",
                tags: ["Casual", "Comfort", "Basic"]
            },
            {
                id: 4,
                name: "Gold Hoop Earrings",
                type: "accessories",
                category: "jewelry",
                color: "#FFD700",
                image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400",
                dateAdded: "2024-01-28",
                tags: ["Accessory", "Statement", "Gold"]
            },
            {
                id: 5,
                name: "Red High Heels",
                type: "shoes",
                category: "heels",
                color: "#FF0000",
                image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=400",
                dateAdded: "2024-01-20",
                tags: ["Party", "Formal", "Bold"]
            }
        ];
        
        this.renderWardrobe();
        this.initWardrobeFilters();
    }

    renderWardrobe() {
        const wardrobeGrid = document.querySelector('.wardrobe-grid');
        if (!wardrobeGrid) return;
        
        if (this.wardrobeItems.length === 0) {
            wardrobeGrid.innerHTML = `
                <div class="wardrobe-placeholder">
                    <i class="fas fa-tshirt"></i>
                    <p>Your wardrobe is empty. Start adding items!</p>
                    <button class="btn-upload" onclick="openUploadModal()">
                        <i class="fas fa-plus"></i> Add First Item
                    </button>
                </div>
            `;
            return;
        }
        
        wardrobeGrid.innerHTML = this.wardrobeItems.map(item => `
            <div class="wardrobe-item" data-id="${item.id}" data-type="${item.type}" data-category="${item.category}">
                <div class="wardrobe-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <div class="wardrobe-item-actions">
                        <button class="action-btn" onclick="vestaApp.getRecommendationsForItem(${item.id})" 
                                title="Get recommendations">
                            <i class="fas fa-lightbulb"></i>
                        </button>
                        <button class="action-btn" onclick="vestaApp.deleteWardrobeItem(${item.id})" 
                                title="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="wardrobe-item-info">
                    <h4>${item.name}</h4>
                    <div class="wardrobe-item-meta">
                        <span class="item-category">${item.category}</span>
                        <span class="item-color" style="background-color: ${item.color}"></span>
                    </div>
                    <div class="wardrobe-item-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="wardrobe-item-date">
                        Added ${this.formatDate(item.dateAdded)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    initWardrobeFilters() {
        const filterButtons = document.querySelectorAll('.wardrobe-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // Filter items
                if (filter === 'all') {
                    document.querySelectorAll('.wardrobe-item').forEach(item => {
                        item.style.display = 'block';
                    });
                } else {
                    document.querySelectorAll('.wardrobe-item').forEach(item => {
                        if (item.dataset.type === filter || item.dataset.category === filter) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    }

    // ===== UPLOAD FUNCTIONALITY =====
    openUploadModal(type = 'clothing') {
        const modal = document.getElementById('uploadModal');
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        // Reset form
        document.getElementById('itemName').value = '';
        document.getElementById('itemCategory').value = 'top';
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
        document.querySelector('.color-option').classList.add('active');
        document.getElementById('itemColor').value = '#000000';
        
        // Set active upload option
        document.querySelectorAll('.upload-option').forEach(opt => opt.classList.remove('active'));
        document.querySelector(`.upload-option[data-type="${type}"]`).classList.add('active');
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Initialize drag and drop
        this.initDragAndDrop(uploadArea, fileInput);
    }

    closeUploadModal() {
        const modal = document.getElementById('uploadModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    initDragAndDrop(uploadArea, fileInput) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        // Handle dropped files
        uploadArea.addEventListener('drop', handleDrop, false);
        
        // Handle file input change
        fileInput.addEventListener('change', handleFiles, false);

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight() {
            uploadArea.classList.add('highlight');
        }

        function unhighlight() {
            uploadArea.classList.remove('highlight');
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles({ target: { files } });
        }

        const handleFiles = (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    // Preview image
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        uploadArea.innerHTML = `
                            <div class="image-preview">
                                <img src="${e.target.result}" alt="Preview">
                                <button class="btn-change" onclick="document.getElementById('fileInput').click()">
                                    Change Image
                                </button>
                            </div>
                        `;
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Please select an image file.');
                }
            }
        };
    }

    uploadItem() {
        const itemName = document.getElementById('itemName').value.trim();
        const itemCategory = document.getElementById('itemCategory').value;
        const itemColor = document.getElementById('itemColor').value;
        const fileInput = document.getElementById('fileInput');
        
        if (!itemName) {
            this.showToast('Please enter item name', 'error');
            return;
        }
        
        if (!fileInput.files.length) {
            this.showToast('Please select an image', 'error');
            return;
        }
        
        // Simulate upload process
        this.showToast('Uploading item...', 'info');
        
        setTimeout(() => {
            // Create new wardrobe item
            const newItem = {
                id: Date.now(),
                name: itemName,
                type: document.querySelector('.upload-option.active').dataset.type,
                category: itemCategory,
                color: itemColor,
                image: URL.createObjectURL(fileInput.files[0]),
                dateAdded: new Date().toISOString().split('T')[0],
                tags: [itemCategory.charAt(0).toUpperCase() + itemCategory.slice(1)]
            };
            
            // Add to wardrobe
            this.wardrobeItems.unshift(newItem);
            
            // Update display
            this.renderWardrobe();
            
            // Close modal
            this.closeUploadModal();
            
            // Show success message
            this.showToast('Item added to wardrobe successfully!', 'success');
            
            // Log for backend integration
            console.log('Item uploaded:', newItem);
            // Here you would typically send to your backend API
            // Example: fetch('/api/wardrobe/upload', { method: 'POST', body: formData })
            
        }, 1500);
    }

    deleteWardrobeItem(itemId) {
        if (confirm('Are you sure you want to remove this item from your wardrobe?')) {
            this.wardrobeItems = this.wardrobeItems.filter(item => item.id !== itemId);
            this.renderWardrobe();
            this.showToast('Item removed from wardrobe', 'success');
        }
    }

    // ===== RECOMMENDATIONS =====
    initRecommendations() {
        // Load sample recommendations
        this.recommendations = [
            {
                id: 1,
                type: "outfit",
                title: "Spring Festival Look",
                description: "Perfect for outdoor festivals and spring events",
                image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w-400",
                confidence: 92,
                items: ["Floral Dress", "Straw Hat", "Sandals"],
                occasion: "Festival",
                season: "Spring"
            },
            {
                id: 2,
                type: "makeup",
                title: "Soft Glam Makeup",
                description: "Elegant makeup for evening events",
                image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w-400",
                confidence: 88,
                items: ["Foundation", "Eyeshadow Palette", "Lipstick"],
                occasion: "Evening",
                skinTone: "Medium"
            },
            {
                id: 3,
                type: "hairstyle",
                title: "Elegant Updo",
                description: "Perfect for weddings and formal events",
                image: "https://images.unsplash.com/photo-1596703923338-48f1c07e4f2e?auto=format&fit=crop&w-400",
                confidence: 95,
                items: ["Hairpins", "Hairspray"],
                occasion: "Wedding",
                hairLength: "Long"
            },
            {
                id: 4,
                type: "accessories",
                title: "Statement Jewelry Set",
                description: "Complete your look with these accessories",
                image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w-400",
                confidence: 85,
                items: ["Necklace", "Earrings", "Bracelet"],
                occasion: "Party",
                style: "Glam"
            }
        ];
        
        this.renderRecommendations();
        this.initRecommendationFilters();
    }

    renderRecommendations() {
        const recommendationsGrid = document.querySelector('.recommendations-grid');
        if (!recommendationsGrid) return;
        
        recommendationsGrid.innerHTML = this.recommendations.map(rec => `
            <div class="recommendation-card" data-type="${rec.type}">
                <div class="recommendation-image">
                    <img src="${rec.image}" alt="${rec.title}" loading="lazy">
                    <div class="recommendation-confidence">
                        <span class="confidence-badge">${rec.confidence}% match</span>
                    </div>
                    <div class="recommendation-actions">
                        <button class="action-btn" onclick="vestaApp.saveRecommendation(${rec.id})" title="Save">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="action-btn" onclick="vestaApp.shareRecommendation(${rec.id})" title="Share">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="recommendation-content">
                    <div class="recommendation-header">
                        <span class="recommendation-type">${rec.type}</span>
                        <span class="recommendation-occasion">${rec.occasion}</span>
                    </div>
                    <h3>${rec.title}</h3>
                    <p>${rec.description}</p>
                    <div class="recommendation-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${rec.season || rec.occasion}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-palette"></i>
                            <span>${rec.skinTone || rec.hairLength || 'All'}</span>
                        </div>
                    </div>
                    <div class="recommendation-items">
                        <strong>Includes:</strong>
                        <div class="items-list">
                            ${rec.items.map(item => `<span class="item-tag">${item}</span>`).join('')}
                        </div>
                    </div>
                    <button class="btn-view-outfit" onclick="vestaApp.viewOutfitDetails(${rec.id})">
                        <i class="fas fa-eye"></i> View Full Look
                    </button>
                </div>
            </div>
        `).join('');
    }

    initRecommendationFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // Filter recommendations
                const recommendations = document.querySelectorAll('.recommendation-card');
                recommendations.forEach(rec => {
                    if (filter === 'all' || rec.dataset.type === filter) {
                        rec.style.display = 'block';
                    } else {
                        rec.style.display = 'none';
                    }
                });
            });
        });
    }

    getRecommendationsForItem(itemId) {
        const item = this.wardrobeItems.find(i => i.id === itemId);
        if (!item) return;
        
        this.showToast(`Finding recommendations for ${item.name}...`, 'info');
        
        // Simulate API call
        setTimeout(() => {
            const modal = this.createRecommendationModal(item);
            document.body.appendChild(modal);
            modal.classList.add('active');
        }, 1000);
    }

    // ===== INSPIRATION SEARCH =====
    initInspirationSearch() {
        const searchInput = document.getElementById('inspirationSearch');
        const searchButton = document.getElementById('searchButton');
        
        if (searchInput && searchButton) {
            searchButton.addEventListener('click', () => this.searchInspiration(searchInput.value));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchInspiration(searchInput.value);
                }
            });
        }
        
        // Load sample inspiration
        this.loadInspirationGallery();
    }

    searchInspiration(query) {
        if (!query.trim()) {
            this.showToast('Please enter a search term', 'error');
            return;
        }
        
        this.showToast(`Searching for "${query}"...`, 'info');
        
        // Simulate search
        setTimeout(() => {
            const results = this.sampleInspiration.filter(item =>
                item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
                item.category.toLowerCase().includes(query.toLowerCase())
            );
            
            this.displaySearchResults(results, query);
        }, 800);
    }

    loadInspirationGallery() {
        this.sampleInspiration = [
            {
                id: 1,
                image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400",
                title: "Evening Glam",
                category: "Makeup",
                tags: ["Glam", "Evening", "Sparkle", "Party"],
                likes: 245,
                saves: 89
            },
            {
                id: 2,
                image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=400",
                title: "Casual Weekend",
                category: "Outfit",
                tags: ["Casual", "Comfort", "Weekend", "Streetwear"],
                likes: 189,
                saves: 56
            },
            {
                id: 3,
                image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400",
                title: "Office Chic",
                category: "Outfit",
                tags: ["Workwear", "Professional", "Office", "Chic"],
                likes: 312,
                saves: 124
            },
            {
                id: 4,
                image: "https://images.unsplash.com/photo-1596703923338-48f1c07e4f2e?auto=format&fit=crop&w=400",
                title: "Wedding Guest",
                category: "Outfit",
                tags: ["Wedding", "Formal", "Elegant", "Guest"],
                likes: 432,
                saves: 178
            }
        ];
        
        this.renderInspirationGallery();
    }

    renderInspirationGallery() {
        const gallery = document.querySelector('.inspiration-gallery');
        if (!gallery) return;
        
        gallery.innerHTML = this.sampleInspiration.map(item => `
            <div class="inspiration-item">
                <div class="inspiration-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="inspiration-overlay">
                        <button class="like-btn" onclick="vestaApp.likeInspiration(${item.id})">
                            <i class="fas fa-heart"></i> ${item.likes}
                        </button>
                        <button class="save-btn" onclick="vestaApp.saveInspiration(${item.id})">
                            <i class="fas fa-bookmark"></i> ${item.saves}
                        </button>
                    </div>
                </div>
                <div class="inspiration-info">
                    <span class="inspiration-category">${item.category}</span>
                    <h4>${item.title}</h4>
                    <div class="inspiration-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ===== EVENTS MANAGEMENT =====
    initEvents() {
        this.events = [
            {
                id: 1,
                name: "College Fest",
                date: "2024-03-15",
                type: "College Event",
                dressCode: "Casual Chic",
                recommendations: ["Jeans & Blazer", "Statement Accessories"],
                status: "upcoming"
            },
            {
                id: 2,
                name: "Friend's Wedding",
                date: "2024-04-20",
                type: "Wedding",
                dressCode: "Semi-Formal",
                recommendations: ["Cocktail Dress", "Elegant Jewelry"],
                status: "upcoming"
            },
            {
                id: 3,
                name: "Job Interview",
                date: "2024-03-10",
                type: "Professional",
                dressCode: "Business Formal",
                recommendations: ["Blazer Set", "Minimal Accessories"],
                status: "completed"
            }
        ];
        
        this.renderEvents();
    }

    // ===== PROFILE MANAGEMENT =====
    initProfile() {
        // Load user data if not already loaded
        if (!this.currentUser) {
            this.loadUserData();
        }
        
        // Initialize profile picture upload
        const profilePicUpload = document.getElementById('profilePicUpload');
        const profilePicInput = document.getElementById('profilePicInput');
        
        if (profilePicUpload && profilePicInput) {
            profilePicUpload.addEventListener('click', () => profilePicInput.click());
            profilePicInput.addEventListener('change', (e) => this.updateProfilePicture(e));
        }
        
        // Initialize preferences editor
        this.initPreferencesEditor();
    }

    // ===== UTILITY FUNCTIONS =====
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        
        return date.toLocaleDateString();
    }

    showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        document.querySelectorAll('.feature-card, .wardrobe-item, .recommendation-card, .inspiration-card').forEach(el => {
            observer.observe(el);
        });
    }

    initTooltips() {
        // Add tooltip functionality to elements with data-tooltip attribute
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.dataset.tooltip;
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                
                e.target._tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', (e) => {
                if (e.target._tooltip) {
                    e.target._tooltip.remove();
                    e.target._tooltip = null;
                }
            });
        });
    }

    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                if (!img.src) {
                    img.dataset.src = img.getAttribute('src');
                    img.removeAttribute('src');
                    imageObserver.observe(img);
                }
            });
        }
    }

    // ===== EVENT LISTENERS =====
    initEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.innerHTML = navMenu.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
        }
        
        // Color picker
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById('itemColor').value = e.target.dataset.color;
            });
        });
        
        // Upload options
        document.querySelectorAll('.upload-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.upload-option').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('uploadModal');
            if (modal && e.target === modal) {
                this.closeUploadModal();
            }
        });
        
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeUploadModal();
            }
        });
    }

    // ===== MOCK API FUNCTIONS (For Demo) =====
    async mockApiCall(endpoint, data = {}) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Return mock responses based on endpoint
        switch (endpoint) {
            case '/api/recommendations':
                return { success: true, data: this.recommendations };
            case '/api/wardrobe':
                return { success: true, data: this.wardrobeItems };
            case '/api/inspiration/search':
                return { 
                    success: true, 
                    data: this.sampleInspiration.filter(item => 
                        item.tags.some(tag => tag.toLowerCase().includes(data.query.toLowerCase()))
                    )
                };
            default:
                return { success: true, data };
        }
    }
}

// ===== GLOBAL FUNCTIONS (For HTML onclick) =====
function openUploadModal(type = 'clothing') {
    vestaApp.openUploadModal(type);
}

function closeUploadModal() {
    vestaApp.closeUploadModal();
}

function uploadItem() {
    vestaApp.uploadItem();
}

// ===== INITIALIZE APP =====
const vestaApp = new VestaApp();

// ===== ADDITIONAL STYLES FOR DYNAMIC ELEMENTS =====
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    /* Toast Notifications */
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        max-width: 400px;
    }
    
    .toast.show {
        transform: translateX(0);
    }
    
    .toast-success .toast-content i { color: #06D6A0; }
    .toast-error .toast-content i { color: #EF476F; }
    .toast-info .toast-content i { color: #118AB2; }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
    }
    
    .toast-close {
        background: none;
        border: none;
        color: #6C757D;
        cursor: pointer;
        padding: 4px;
    }
    
    /* Tooltips */
    .tooltip {
        position: fixed;
        background: var(--dark);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        white-space: nowrap;
        z-index: 10000;
        pointer-events: none;
    }
    
    /* Wardrobe Items */
    .wardrobe-item {
        background: white;
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        transition: var(--transition-normal);
    }
    
    .wardrobe-item:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }
    
    .wardrobe-item-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }
    
    .wardrobe-item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    .wardrobe-item:hover .wardrobe-item-image img {
        transform: scale(1.05);
    }
    
    .wardrobe-item-actions {
        position: absolute;
        top: 12px;
        right: 12px;
        display: flex;
        gap: 8px;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }
    
    .wardrobe-item:hover .wardrobe-item-actions {
        opacity: 1;
        transform: translateY(0);
    }
    
    .wardrobe-item-actions .action-btn {
        width: 36px;
        height: 36px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-sm);
    }
    
    .wardrobe-item-info {
        padding: 16px;
    }
    
    .wardrobe-item-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
    }
    
    .item-category {
        background: var(--gray-light);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
    }
    
    .item-color {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 0 1px var(--gray-light);
    }
    
    .wardrobe-item-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 12px;
    }
    
    .wardrobe-item-date {
        font-size: 0.85rem;
        color: var(--gray);
    }
    
    /* Recommendation Cards */
    .recommendation-card {
        background: white;
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        transition: var(--transition-normal);
    }
    
    .recommendation-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }
    
    .recommendation-image {
        position: relative;
        height: 250px;
        overflow: hidden;
    }
    
    .recommendation-confidence {
        position: absolute;
        top: 12px;
        left: 12px;
    }
    
    .confidence-badge {
        background: var(--success);
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
    }
    
    .recommendation-actions {
        position: absolute;
        top: 12px;
        right: 12px;
        display: flex;
        gap: 8px;
    }
    
    .recommendation-content {
        padding: 20px;
    }
    
    .recommendation-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
    }
    
    .recommendation-type {
        background: var(--primary);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
    }
    
    .recommendation-occasion {
        background: var(--gray-light);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
    }
    
    .recommendation-details {
        display: flex;
        gap: 20px;
        margin: 16px 0;
    }
    
    .detail-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--gray);
        font-size: 0.9rem;
    }
    
    .items-list {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-top: 8px;
    }
    
    .btn-view-outfit {
        width: 100%;
        margin-top: 16px;
        padding: 12px;
        background: var(--primary);
        color: white;
        border-radius: var(--radius-md);
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    
    /* Animations */
    .animate {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(dynamicStyles);

// ===== EXPORT FOR MODULES =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VestaApp;
}

console.log('VESTA Application initialized successfully!');
console.log('Project: AI-Powered Personal Styling Platform');
console.log('Tech Stack: MERN (MongoDB, Express.js, React, Node.js)');
console.log('Developer: BTech CS Student - Portfolio Project');