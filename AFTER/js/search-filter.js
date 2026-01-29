// Search and Filter Manager - Handles search, filtering, and sorting

const SearchFilter = {
    searchQuery: '',
    selectedCategory: 'all',
    sortBy: 'newest',
    showingFavoritesOnly: false,
    
    // Initialize search and filter
    init() {
        this.setupEventListeners();
        console.log('✅ Search & Filter initialized');
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Search input with debounce
        const searchInput = document.getElementById('searchInput');
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.applyFilters();
            }, 300); // Debounce 300ms
        });
        
        // Category filter
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.selectedCategory = e.target.value;
            this.applyFilters();
        });
        
        // Sort filter
        document.getElementById('sortFilter').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFilters();
        });
        
        // Favorites only button
        document.getElementById('showFavoritesBtn').addEventListener('click', () => {
            this.toggleFavoritesOnly();
        });
        
        // Reset filters button
        document.getElementById('resetFiltersBtn').addEventListener('click', () => {
            this.resetFilters();
        });
    },
    
    // Apply all filters
    applyFilters() {
        let prompts = StorageManager.getAll();
        
        // Apply search filter
        if (this.searchQuery) {
            prompts = prompts.filter(prompt => {
                const searchableText = [
                    prompt.title,
                    prompt.prompt,
                    prompt.category,
                    ...prompt.tags
                ].join(' ').toLowerCase();
                
                return searchableText.includes(this.searchQuery);
            });
        }
        
        // Apply category filter
        if (this.selectedCategory !== 'all') {
            prompts = prompts.filter(prompt => 
                prompt.category === this.selectedCategory
            );
        }
        
        // Apply favorites filter
        if (this.showingFavoritesOnly) {
            prompts = prompts.filter(prompt => prompt.isFavorite);
        }
        
        // Apply sorting
        prompts = this.sortPrompts(prompts);
        
        // Update UI
        PromptManager.currentPrompts = prompts;
        PromptManager.renderPrompts(prompts);
        
        // Update filter button state
        this.updateFilterButtonState();
    },
    
    // Sort prompts based on selected criteria
    sortPrompts(prompts) {
        const sorted = [...prompts];
        
        switch (this.sortBy) {
            case 'newest':
                return sorted.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
            
            case 'oldest':
                return sorted.sort((a, b) => 
                    new Date(a.createdAt) - new Date(b.createdAt)
                );
            
            case 'lastUsed':
                return sorted.sort((a, b) => 
                    new Date(b.lastUsed) - new Date(a.lastUsed)
                );
            
            case 'title':
                return sorted.sort((a, b) => 
                    a.title.localeCompare(b.title)
                );
            
            default:
                return sorted;
        }
    },
    
    // Toggle favorites only filter
    toggleFavoritesOnly() {
        this.showingFavoritesOnly = !this.showingFavoritesOnly;
        this.applyFilters();
    },
    
    // Update favorites button visual state
    updateFilterButtonState() {
        const favBtn = document.getElementById('showFavoritesBtn');
        
        if (this.showingFavoritesOnly) {
            favBtn.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
            favBtn.style.color = '#ffffff';
            favBtn.style.borderColor = '#f59e0b';
        } else {
            favBtn.style.background = 'transparent';
            favBtn.style.color = '#6b7280';
            favBtn.style.borderColor = '#e5e7eb';
        }
    },
    
    // Reset all filters
    resetFilters() {
        // Reset state
        this.searchQuery = '';
        this.selectedCategory = 'all';
        this.sortBy = 'newest';
        this.showingFavoritesOnly = false;
        
        // Reset UI elements
        document.getElementById('searchInput').value = '';
        document.getElementById('categoryFilter').value = 'all';
        document.getElementById('sortFilter').value = 'newest';
        
        // Apply reset filters
        this.applyFilters();
        
        // Show feedback
        PromptManager.showToast('Filters reset', 'success');
    },
    
    // Get active filters count (for UI feedback)
    getActiveFiltersCount() {
        let count = 0;
        
        if (this.searchQuery) count++;
        if (this.selectedCategory !== 'all') count++;
        if (this.showingFavoritesOnly) count++;
        if (this.sortBy !== 'newest') count++;
        
        return count;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for PromptManager to initialize first
    setTimeout(() => {
        SearchFilter.init();
    }, 100);
});

// Export for use in other files
window.SearchFilter = SearchFilter;

console.log('✅ Search & Filter loaded');