// Storage Manager - Handles all LocalStorage operations

const StorageManager = {
    STORAGE_KEY: 'promptLibrary',
    
    // Initialize storage with sample data if empty
    init() {
        if (!this.hasData()) {
            this.loadSampleData();
        }
        console.log('✅ Storage initialized');
    },
    
    // Check if storage has data
    hasData() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data !== null && JSON.parse(data).length > 0;
    },
    
    // Load sample data from JSON file
    async loadSampleData() {
        try {
            const response = await fetch('data/sample-prompts.json');
            const samplePrompts = await response.json();
            this.saveAll(samplePrompts);
            console.log('✅ Sample data loaded:', samplePrompts.length, 'prompts');
        } catch (error) {
            console.error('Failed to load sample data:', error);
            // Initialize with empty array if sample data fails
            this.saveAll([]);
        }
    },
    
    // Get all prompts
    getAll() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading from storage:', error);
            return [];
        }
    },
    
    // Save all prompts
    saveAll(prompts) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prompts));
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            return false;
        }
    },
    
    // Get single prompt by ID
    getById(id) {
        const prompts = this.getAll();
        return prompts.find(p => p.id === id);
    },
    
    // Add new prompt
    add(prompt) {
        const prompts = this.getAll();
        
        // Generate new ID
        const maxId = prompts.length > 0 
            ? Math.max(...prompts.map(p => p.id)) 
            : 0;
        
        const newPrompt = {
            ...prompt,
            id: maxId + 1,
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            isFavorite: false
        };
        
        prompts.push(newPrompt);
        this.saveAll(prompts);
        
        return newPrompt;
    },
    
    // Update existing prompt
    update(id, updates) {
        const prompts = this.getAll();
        const index = prompts.findIndex(p => p.id === id);
        
        if (index === -1) {
            console.error('Prompt not found:', id);
            return false;
        }
        
        prompts[index] = {
            ...prompts[index],
            ...updates
        };
        
        return this.saveAll(prompts);
    },
    
    // Delete prompt
    delete(id) {
        const prompts = this.getAll();
        const filtered = prompts.filter(p => p.id !== id);
        
        if (filtered.length === prompts.length) {
            console.error('Prompt not found:', id);
            return false;
        }
        
        return this.saveAll(filtered);
    },
    
    // Toggle favorite status
    toggleFavorite(id) {
        const prompt = this.getById(id);
        if (!prompt) return false;
        
        return this.update(id, {
            isFavorite: !prompt.isFavorite
        });
    },
    
    // Update last used timestamp
    updateLastUsed(id) {
        return this.update(id, {
            lastUsed: new Date().toISOString()
        });
    },
    
    // Get all unique categories
    getCategories() {
        const prompts = this.getAll();
        const categories = [...new Set(prompts.map(p => p.category))];
        return categories.sort();
    },
    
    // Get all unique tags
    getTags() {
        const prompts = this.getAll();
        const allTags = prompts.flatMap(p => p.tags || []);
        const uniqueTags = [...new Set(allTags)];
        return uniqueTags.sort();
    },
    
    // Get statistics
    getStats() {
        const prompts = this.getAll();
        return {
            total: prompts.length,
            categories: this.getCategories().length,
            favorites: prompts.filter(p => p.isFavorite).length,
            tags: this.getTags().length
        };
    },
    
    // Export all data as JSON
    exportJSON() {
        return JSON.stringify(this.getAll(), null, 2);
    },
    
    // Import data from JSON
    importJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format');
            }
            
            this.saveAll(data);
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    },
    
    // Clear all data
    clearAll() {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('🗑️ All data cleared');
    }
};

// Initialize storage when script loads
StorageManager.init();

// Export for use in other files
window.StorageManager = StorageManager;

console.log('✅ Storage Manager loaded');
