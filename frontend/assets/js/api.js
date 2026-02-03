// frontend/assets/js/api.js - FIXED VERSION
const API_BASE = 'http://localhost:5000/api';

class VestaAPI {
    constructor() {
        this.token = localStorage.getItem('vesta_token');
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
        
        const response = await fetch(url, {
            method: options.method || 'GET',
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Request failed');
        return data;
    }

    // FIXED ENDPOINTS
    async register(userData) { 
        return await this.request('/auth/register', { method: 'POST', body: userData });
    }
    async login(credentials) { 
        return await this.request('/auth/login', { method: 'POST', body: credentials });
    }
    async getCurrentUser() { 
        return await this.request('/auth/me'); 
    }
    async getWardrobe() { 
        return await this.request('/wardrobe'); 
    }
    async addToWardrobe(itemData) { 
        return await this.request('/wardrobe', { method: 'POST', body: itemData }); 
    }
    async getRecommendations(skinTone, occasion) {
        return await this.request(`/styles/recommendations?skinTone=${skinTone}&occasion=${occasion}`);
    }
}

window.vestaAPI = new VestaAPI();
