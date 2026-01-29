// Prompt Manager - Handles UI rendering and CRUD operations

const PromptManager = {
    currentPrompts: [],
    editingId: null,
    
    // Initialize the app
    init() {
        this.loadPrompts();
        this.updateStats();
        this.populateCategoryFilter();
        this.setupEventListeners();
        console.log('✅ Prompt Manager initialized');
    },
    
    // Load and display prompts
    loadPrompts() {
        this.currentPrompts = StorageManager.getAll();
        this.renderPrompts(this.currentPrompts);
    },
    
    // Render prompts to the grid
    renderPrompts(prompts) {
        const container = document.getElementById('promptsContainer');
        const emptyState = document.getElementById('emptyState');
        
        if (prompts.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        container.innerHTML = prompts.map(prompt => `
            <div class="prompt-card fade-in" data-id="${prompt.id}">
                <div class="prompt-header">
                    <h3 class="prompt-title">${this.escapeHtml(prompt.title)}</h3>
                    <div class="prompt-actions">
                        <button class="icon-btn favorite-btn ${prompt.isFavorite ? 'active' : ''}" 
                                data-id="${prompt.id}" 
                                title="Toggle favorite">
                            ${prompt.isFavorite ? '⭐' : '☆'}
                        </button>
                        <button class="icon-btn edit-btn" 
                                data-id="${prompt.id}"
                                title="Edit prompt">
                            ✏️
                        </button>
                        <button class="icon-btn delete-btn" 
                                data-id="${prompt.id}"
                                title="Delete prompt">
                            🗑️
                        </button>
                    </div>
                </div>
                
                <div class="prompt-category">${this.escapeHtml(prompt.category)}</div>
                
                <p class="prompt-text">${this.escapeHtml(prompt.prompt)}</p>
                
                <div class="prompt-tags">
                    ${prompt.tags.map(tag => 
                        `<span class="tag">${this.escapeHtml(tag)}</span>`
                    ).join('')}
                </div>
                
                <div class="prompt-footer">
                    <span title="Last used">
                        📅 ${this.formatDate(prompt.lastUsed)}
                    </span>
                    <button class="copy-btn" data-id="${prompt.id}">
                        📋 Copy
                    </button>
                </div>
            </div>
        `).join('');
        
        // Attach event listeners to new buttons
        this.attachCardEventListeners();
    },
    
    // Attach event listeners to card buttons
    attachCardEventListeners() {
        // Favorite buttons
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.toggleFavorite(id);
            });
        });
        
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.openEditModal(id);
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.deletePrompt(id);
            });
        });
        
        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.copyPrompt(id);
            });
        });
    },
    
    // Setup main event listeners
    setupEventListeners() {
        // Add prompt button
        document.getElementById('addPromptBtn').addEventListener('click', () => {
            this.openAddModal();
        });
        
        // Modal close buttons
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Form submit
        document.getElementById('promptForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePrompt();
        });
        
        // Character counter
        document.getElementById('promptText').addEventListener('input', (e) => {
            this.updateCharCount(e.target.value);
        });
        
        // Click outside modal to close
        document.getElementById('promptModal').addEventListener('click', (e) => {
            if (e.target.id === 'promptModal') {
                this.closeModal();
            }
        });
    },
    
    // Open add modal
    openAddModal() {
        this.editingId = null;
        document.getElementById('modalTitle').textContent = 'Add New Prompt';
        document.getElementById('saveButtonText').textContent = 'Save Prompt';
        document.getElementById('promptForm').reset();
        this.updateCharCount('');
        document.getElementById('promptModal').style.display = 'flex';
    },
    
    // Open edit modal
    openEditModal(id) {
        const prompt = StorageManager.getById(id);
        if (!prompt) return;
        
        this.editingId = id;
        document.getElementById('modalTitle').textContent = 'Edit Prompt';
        document.getElementById('saveButtonText').textContent = 'Update Prompt';
        
        document.getElementById('promptTitle').value = prompt.title;
        document.getElementById('promptText').value = prompt.prompt;
        document.getElementById('promptCategory').value = prompt.category;
        document.getElementById('promptTags').value = prompt.tags.join(', ');
        
        this.updateCharCount(prompt.prompt);
        document.getElementById('promptModal').style.display = 'flex';
    },
    
    // Close modal
    closeModal() {
        document.getElementById('promptModal').style.display = 'none';
        this.editingId = null;
    },
    
    // Save prompt (add or update)
    savePrompt() {
        const title = document.getElementById('promptTitle').value.trim();
        const prompt = document.getElementById('promptText').value.trim();
        const category = document.getElementById('promptCategory').value.trim();
        const tagsInput = document.getElementById('promptTags').value.trim();
        
        // Parse tags
        const tags = tagsInput 
            ? tagsInput.split(',').map(t => t.trim()).filter(t => t)
            : [];
        
        const promptData = {
            title,
            prompt,
            category,
            tags
        };
        
        if (this.editingId) {
            // Update existing
            StorageManager.update(this.editingId, promptData);
            this.showToast('Prompt updated successfully!', 'success');
        } else {
            // Add new
            StorageManager.add(promptData);
            this.showToast('Prompt added successfully!', 'success');
        }
        
        this.closeModal();
        this.loadPrompts();
        this.updateStats();
        this.populateCategoryFilter();
        
        // Trigger search/filter refresh if active
        if (window.SearchFilter) {
            window.SearchFilter.applyFilters();
        }
    },
    
    // Toggle favorite status
    toggleFavorite(id) {
        StorageManager.toggleFavorite(id);
        this.loadPrompts();
        this.updateStats();
        
        // Refresh filters if showing favorites only
        if (window.SearchFilter && window.SearchFilter.showingFavoritesOnly) {
            window.SearchFilter.applyFilters();
        }
    },
    
    // Delete prompt
    deletePrompt(id) {
        const prompt = StorageManager.getById(id);
        if (!prompt) return;
        
        if (confirm(`Delete "${prompt.title}"?`)) {
            StorageManager.delete(id);
            this.loadPrompts();
            this.updateStats();
            this.populateCategoryFilter();
            this.showToast('Prompt deleted', 'success');
            
            // Refresh filters
            if (window.SearchFilter) {
                window.SearchFilter.applyFilters();
            }
        }
    },
    
    // Copy prompt to clipboard
    copyPrompt(id) {
        const prompt = StorageManager.getById(id);
        if (!prompt) return;
        
        navigator.clipboard.writeText(prompt.prompt).then(() => {
            StorageManager.updateLastUsed(id);
            this.showToast('Copied to clipboard!', 'success');
            
            // Update the last used date in UI without full reload
            const card = document.querySelector(`[data-id="${id}"]`);
            if (card) {
                const footer = card.querySelector('.prompt-footer span');
                footer.innerHTML = `📅 ${this.formatDate(new Date().toISOString())}`;
            }
        }).catch(err => {
            console.error('Copy failed:', err);
            this.showToast('Failed to copy', 'error');
        });
    },
    
    // Update statistics
    updateStats() {
        const stats = StorageManager.getStats();
        document.getElementById('totalPrompts').textContent = stats.total;
        document.getElementById('totalCategories').textContent = stats.categories;
        document.getElementById('totalFavorites').textContent = stats.favorites;
    },
    
    // Populate category filter dropdown
    populateCategoryFilter() {
        const categories = StorageManager.getCategories();
        const select = document.getElementById('categoryFilter');
        
        // Keep "All Categories" option
        select.innerHTML = '<option value="all">All Categories</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
    },
    
    // Update character count
    updateCharCount(text) {
        document.getElementById('charCount').textContent = `${text.length} characters`;
    },
    
    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                toast.style.display = 'none';
                toast.style.animation = '';
            }, 300);
        }, 3000);
    },
    
    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Format date for display
    formatDate(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PromptManager.init();
});

// Export for use in other files
window.PromptManager = PromptManager;

console.log('✅ Prompt Manager loaded');