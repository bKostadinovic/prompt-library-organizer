// Export Handler - Manages JSON and Markdown export functionality

const ExportHandler = {
    // Initialize export functionality
    init() {
        this.setupEventListeners();
        console.log('✅ Export Handler initialized');
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Main export button
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.openExportModal();
        });
        
        // Export modal close
        document.getElementById('closeExportModal').addEventListener('click', () => {
            this.closeExportModal();
        });
        
        // Export JSON button
        document.getElementById('exportJsonBtn').addEventListener('click', () => {
            this.exportAsJSON();
        });
        
        // Export Markdown button
        document.getElementById('exportMarkdownBtn').addEventListener('click', () => {
            this.exportAsMarkdown();
        });
        
        // Click outside modal to close
        document.getElementById('exportModal').addEventListener('click', (e) => {
            if (e.target.id === 'exportModal') {
                this.closeExportModal();
            }
        });
    },
    
    // Open export modal
    openExportModal() {
        document.getElementById('exportModal').style.display = 'flex';
    },
    
    // Close export modal
    closeExportModal() {
        document.getElementById('exportModal').style.display = 'none';
    },
    
    // Export as JSON
    exportAsJSON() {
        try {
            const prompts = StorageManager.getAll();
            const jsonString = JSON.stringify(prompts, null, 2);
            
            this.downloadFile(
                jsonString,
                `prompt-library-${this.getDateString()}.json`,
                'application/json'
            );
            
            this.closeExportModal();
            PromptManager.showToast(`Exported ${prompts.length} prompts as JSON`, 'success');
            
        } catch (error) {
            console.error('JSON export failed:', error);
            PromptManager.showToast('Export failed', 'error');
        }
    },
    
    // Export as Markdown
    exportAsMarkdown() {
        try {
            const prompts = StorageManager.getAll();
            const markdown = this.generateMarkdown(prompts);
            
            this.downloadFile(
                markdown,
                `prompt-library-${this.getDateString()}.md`,
                'text/markdown'
            );
            
            this.closeExportModal();
            PromptManager.showToast(`Exported ${prompts.length} prompts as Markdown`, 'success');
            
        } catch (error) {
            console.error('Markdown export failed:', error);
            PromptManager.showToast('Export failed', 'error');
        }
    },
    
    // Generate Markdown content
    generateMarkdown(prompts) {
        let markdown = `# Prompt Library\n\n`;
        markdown += `**Exported:** ${new Date().toLocaleString()}\n`;
        markdown += `**Total Prompts:** ${prompts.length}\n\n`;
        markdown += `---\n\n`;
        
        // Group by category
        const categories = [...new Set(prompts.map(p => p.category))].sort();
        
        categories.forEach(category => {
            const categoryPrompts = prompts.filter(p => p.category === category);
            
            markdown += `## ${category}\n\n`;
            
            categoryPrompts.forEach((prompt, index) => {
                markdown += `### ${index + 1}. ${prompt.title}\n\n`;
                
                // Favorite indicator
                if (prompt.isFavorite) {
                    markdown += `⭐ **Favorite**\n\n`;
                }
                
                // Prompt text
                markdown += `**Prompt:**\n\n`;
                markdown += `\`\`\`\n${prompt.prompt}\n\`\`\`\n\n`;
                
                // Tags
                if (prompt.tags && prompt.tags.length > 0) {
                    markdown += `**Tags:** ${prompt.tags.map(t => `\`${t}\``).join(', ')}\n\n`;
                }
                
                // Metadata
                markdown += `**Created:** ${new Date(prompt.createdAt).toLocaleDateString()}\n`;
                markdown += `**Last Used:** ${new Date(prompt.lastUsed).toLocaleDateString()}\n\n`;
                
                markdown += `---\n\n`;
            });
        });
        
        // Add statistics at the end
        markdown += `## Statistics\n\n`;
        markdown += `- **Total Prompts:** ${prompts.length}\n`;
        markdown += `- **Categories:** ${categories.length}\n`;
        markdown += `- **Favorites:** ${prompts.filter(p => p.isFavorite).length}\n`;
        markdown += `- **Total Tags:** ${this.countUniqueTags(prompts)}\n\n`;
        
        return markdown;
    },
    
    // Download file
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
    },
    
    // Get formatted date string for filename
    getDateString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        return `${year}${month}${day}-${hours}${minutes}`;
    },
    
    // Count unique tags
    countUniqueTags(prompts) {
        const allTags = prompts.flatMap(p => p.tags || []);
        return new Set(allTags).size;
    },
    
    // Import from JSON file (bonus feature for setup guide)
    async importFromFile(file) {
        try {
            const text = await file.text();
            const success = StorageManager.importJSON(text);
            
            if (success) {
                PromptManager.loadPrompts();
                PromptManager.updateStats();
                PromptManager.populateCategoryFilter();
                PromptManager.showToast('Import successful!', 'success');
                return true;
            } else {
                PromptManager.showToast('Import failed - invalid format', 'error');
                return false;
            }
        } catch (error) {
            console.error('Import error:', error);
            PromptManager.showToast('Import failed', 'error');
            return false;
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for other managers to initialize
    setTimeout(() => {
        ExportHandler.init();
    }, 150);
});

// Export for use in other files
window.ExportHandler = ExportHandler;

console.log('✅ Export Handler loaded');