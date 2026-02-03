// frontend/assets/js/wardrobe.js - PRODUCTION READY
document.addEventListener('DOMContentLoaded', async function() {
    const api = window.vestaAPI;
    
    // Check auth
    if (!localStorage.getItem('vesta_token')) {
        window.location.href = 'login.html';
        return;
    }
    
    loadWardrobe();
    
    // Upload form
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const itemData = {
                name: document.getElementById('itemName').value,
                category: document.getElementById('itemCategory').value,
                color: document.getElementById('itemColor').value,
                tags: document.getElementById('itemTags').value
            };
            
            try {
                await api.addToWardrobe(itemData);
                showNotification('✅ Item added to wardrobe!', 'success');
                uploadForm.reset();
                closeUploadModal();
                loadWardrobe(); // Refresh
            } catch (error) {
                showNotification('❌ ' + error.message, 'error');
            }
        });
    }
});

async function loadWardrobe() {
    const api = window.vestaAPI;
    const grid = document.getElementById('wardrobeGrid');
    const countEl = document.getElementById('itemCount');
    
    try {
        const response = await api.getWardrobe();
        const items = response.data || [];
        
        countEl.textContent = `Found ${items.length} items`;
        
        if (items.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 80px; color: var(--muted);">
                    <i class="fas fa-tshirt" style="font-size: 5rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>Your closet is empty ✨</h3>
                    <p>Upload your first outfit to unlock personalized styling</p>
                    <button class="btn-gold" onclick="openUploadModal()" style="margin-top: 24px; padding: 12px 32px;">
                        <i class="fas fa-plus"></i> Add First Item
                    </button>
                </div>
            `;
        } else {
            grid.innerHTML = items.map(item => `
                <div class="wardrobe-card">
                    <div class="wardrobe-image">
                        <img src="${item.imageUrl || item.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400'}" alt="${item.name}">
                    </div>
                    <div style="padding: 20px;">
                        <h4 style="margin: 0 0 8px 0; font-size: 1.1rem;">${item.name}</h4>
                        <div style="display: flex; gap: 12px; margin-bottom: 12px; font-size: 0.9rem; color: var(--muted);">
                            <span class="category-badge">${item.category}</span>
                            <span style="background: var(--secondary); padding: 4px 12px; border-radius: 20px;">${item.color}</span>
                        </div>
                        ${item.tags?.length ? `<div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            ${item.tags.map(tag => `<span style="font-size: 0.8rem; background: var(--muted); padding: 4px 12px; border-radius: 12px;">${tag}</span>`).join('')}
                        </div>` : ''}
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">Failed to load wardrobe. <button onclick="loadWardrobe()" class="btn-link">Retry</button></p>`;
    }
}

function openUploadModal() {
    document.getElementById('uploadModal').style.display = 'block';
}

function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
}

function showNotification(message, type) {
    // Simple notification (upgrade later)
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed; top: 20px; right: 20px; 
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white; padding: 16px 24px; border-radius: 12px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 10000;
        ">
            ${message}
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}
