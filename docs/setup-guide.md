# Setup Guide

## For Non-Technical Users

### Quick Start (2 minutes)

1. **Download the Tool**
   - Download the `AFTER` folder from GitHub
   - Or use the deployed version (see README for link)

2. **Open the Tool**
   - Double-click `index.html` in the AFTER folder
   - Opens in your default browser
   - No installation needed!

3. **Start Using**
   - Your prompts are automatically loaded
   - Add, edit, search, and organize immediately
   - Data saves automatically in your browser

### Adding Your First Prompt

1. Click the **"➕ Add Prompt"** button
2. Fill in the form:
   - **Title:** Short, descriptive name (e.g., "SEO Blog Outline")
   - **Prompt:** Your full prompt text (use [BRACKETS] for variables)
   - **Category:** Type a category or select from suggestions
   - **Tags:** Optional, comma-separated (e.g., "SEO, blogging, content")
3. Click **"Save Prompt"**
4. Done! Your prompt appears in the library

### Using Your Prompts

**To Copy a Prompt:**
- Click the **📋 Copy** button on any prompt card
- Paste directly into ChatGPT, Claude, or any AI tool

**To Mark as Favorite:**
- Click the **☆** star icon
- Starred prompts show ⭐ and can be filtered

**To Edit:**
- Click the **✏️ Edit** button
- Make changes in the modal
- Click "Update Prompt"

**To Delete:**
- Click the **🗑️ Delete** button
- Confirm the deletion

### Organizing Your Library

**Search:**
- Type in the search box at the top
- Searches across titles, content, categories, and tags
- Results filter instantly

**Filter by Category:**
- Use the category dropdown
- Shows only prompts in that category

**Show Favorites Only:**
- Click **"⭐ Favorites Only"** button
- Button turns orange when active
- Click again to show all prompts

**Sort:**
- Use the sort dropdown
- Options: Newest, Oldest, Recently Used, Alphabetical

**Reset Everything:**
- Click **"🔄 Reset"** to clear all filters

### Backing Up Your Prompts

**Export as JSON (Recommended):**
1. Click **"📥 Export"** button
2. Click **"📄 Export as JSON"**
3. File downloads to your computer
4. Keep this file safe - you can re-import it anytime

**Export as Markdown:**
1. Click **"📥 Export"** button
2. Click **"📝 Export as Markdown"**
3. Get a human-readable document
4. Perfect for sharing with team or printing

---

## For Developers

### Installation
```bash
# Clone repository
git clone https://github.com/bKostadinovic/prompt-library-organizer.git

# Navigate to working version
cd prompt-library-organizer/AFTER

# No build process needed - pure HTML/CSS/JS
# Open index.html in browser or use Live Server
```

### Tech Stack

**Core Technologies:**
- HTML5 - Semantic structure
- CSS3 - Grid, Flexbox, animations
- JavaScript (ES6+) - Vanilla JS, no frameworks
- LocalStorage API - Client-side persistence
- Clipboard API - One-click copy
- Blob API - File downloads

**No dependencies, no build tools, no npm.**

---

### File Structure
```
AFTER/
├── index.html              # Main application
├── css/
│   └── styles.css          # All styling
├── js/
│   ├── storage.js          # LocalStorage management
│   ├── prompt-manager.js   # CRUD operations & UI
│   ├── search-filter.js    # Search, filter, sort logic
│   └── export-handler.js   # JSON/Markdown export
└── data/
    └── sample-prompts.json # Initial sample data
```

---

### How It Works

**Data Flow:**

1. **Initialization:**
   - `storage.js` checks LocalStorage
   - If empty, loads `sample-prompts.json`
   - If data exists, uses stored prompts

2. **Display:**
   - `prompt-manager.js` renders prompts as cards
   - Updates statistics (total, categories, favorites)

3. **User Actions:**
   - Add/Edit: Modal form → Save to storage → Re-render
   - Delete: Confirm → Remove from storage → Re-render
   - Copy: Clipboard API → Update last used timestamp

4. **Filtering:**
   - `search-filter.js` applies filters to data
   - Passes filtered array to `prompt-manager.js`
   - UI updates with filtered results

5. **Export:**
   - `export-handler.js` gets data from storage
   - Generates JSON or Markdown string
   - Creates Blob and triggers download

---

### Customization

#### Change Color Scheme

Edit `css/styles.css`:
```css
:root {
    --primary: #6366f1;        /* Change to your brand color */
    --secondary: #8b5cf6;      /* Complementary color */
    --success: #10b981;        /* Success/copy color */
}

body {
    background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}
```

#### Add New Categories

Sample categories are pre-defined in the datalist:
```html
<datalist id="categoryList">
    <option value="Your New Category">
</datalist>
```

Or just type a new category when adding a prompt - it's automatically added to the filter dropdown.

#### Modify Sample Data

Edit `data/sample-prompts.json`:
```json
[
  {
    "id": 1,
    "title": "Your Prompt Title",
    "prompt": "Your prompt text here",
    "category": "Your Category",
    "tags": ["tag1", "tag2"],
    "isFavorite": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "lastUsed": "2024-01-28T14:20:00Z"
  }
]
```

#### Add New Fields

1. Update data structure in `storage.js`
2. Add form fields in `index.html`
3. Update render function in `prompt-manager.js`
4. Update export functions in `export-handler.js`

---

### Deployment

**Static Hosting (Recommended):**

**Netlify:**
```bash
# Drag and drop AFTER folder
# Or use Netlify CLI
cd AFTER
netlify deploy --prod
```

**Vercel:**
```bash
cd AFTER
vercel --prod
```

**GitHub Pages:**
1. Push AFTER folder to repository
2. Settings → Pages → Select branch and /AFTER folder
3. Save

**Traditional Hosting:**
- Upload AFTER folder via FTP
- Access at `yourdomain.com/AFTER/`

---

### Data Management

**LocalStorage Key:**
```javascript
'promptLibrary' // All data stored under this key
```

**Data Structure:**
```javascript
[
  {
    id: 1,                              // Auto-increment
    title: "Prompt Title",              // Required
    prompt: "Full prompt text",         // Required
    category: "Category Name",          // Required
    tags: ["tag1", "tag2"],            // Array
    isFavorite: false,                  // Boolean
    createdAt: "ISO timestamp",         // Auto-generated
    lastUsed: "ISO timestamp"           // Auto-updated on copy
  }
]
```

**Storage Limits:**
- LocalStorage: ~5-10MB per domain
- Typical prompt: ~500 bytes
- Can store: 10,000-20,000 prompts

---

### API Reference

**StorageManager:**
```javascript
// Get all prompts
StorageManager.getAll()

// Get single prompt
StorageManager.getById(id)

// Add new prompt
StorageManager.add({ title, prompt, category, tags })

// Update prompt
StorageManager.update(id, { title: "New Title" })

// Delete prompt
StorageManager.delete(id)

// Toggle favorite
StorageManager.toggleFavorite(id)

// Get statistics
StorageManager.getStats()

// Export as JSON string
StorageManager.exportJSON()

// Import from JSON string
StorageManager.importJSON(jsonString)

// Clear all data
StorageManager.clearAll()
```

**PromptManager:**
```javascript
// Refresh display
PromptManager.loadPrompts()

// Update statistics
PromptManager.updateStats()

// Show toast notification
PromptManager.showToast(message, type)
```

**SearchFilter:**
```javascript
// Apply current filters
SearchFilter.applyFilters()

// Reset all filters
SearchFilter.resetFilters()

// Get active filter count
SearchFilter.getActiveFiltersCount()
```

---

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| LocalStorage | ✅ | ✅ | ✅ | ✅ |
| Clipboard API | ✅ | ✅ | ✅ | ✅ |
| ES6+ JavaScript | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |

**Minimum versions:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

---

### Performance Tips

**For Large Collections (500+ prompts):**

1. **Implement pagination:**
   - Show 50 prompts per page
   - Add "Load More" button

2. **Virtual scrolling:**
   - Only render visible cards
   - Use IntersectionObserver

3. **Debounce search:**
   - Already implemented (300ms)
   - Adjust in `search-filter.js` if needed

---

### Troubleshooting

**Q: Prompts disappeared after clearing browser data**
- LocalStorage was cleared with browser data
- Import from your backup JSON file
- Or let it reload sample data

**Q: Copy button not working**
- Check browser clipboard permissions
- Requires HTTPS or localhost

**Q: Export downloads empty file**
- Check browser console for errors
- Ensure prompts exist in storage

**Q: Search not working**
- Clear search box and try again
- Check console for JavaScript errors

---

### Security & Privacy

**Data Storage:**
- All data stored in browser LocalStorage
- No data sent to any server
- No tracking or analytics
- No cookies required

**Privacy:**
- Works completely offline
- No login or account needed
- No external API calls
- Your prompts never leave your computer

**Backup Recommendations:**
- Export JSON weekly
- Store backup in multiple locations
- Consider syncing export file to cloud (Dropbox, Google Drive)

---

### Extending the Tool

**Ideas for Enhancement:**

1. **Cloud Sync:**
   - Add Firebase/Supabase backend
   - Sync across devices

2. **Team Sharing:**
   - Real-time collaboration
   - User permissions

3. **AI Integration:**
   - Auto-generate tags from content
   - Suggest related prompts
   - Quality scoring

4. **Version History:**
   - Track prompt edits
   - Restore previous versions

5. **Prompt Templates:**
   - Pre-filled templates
   - Variable placeholders

6. **Usage Analytics:**
   - Track most-used prompts
   - Success rate tracking

---

## Support

For questions about this code:
- **GitHub:** https://github.com/bKostadinovic/prompt-library-organizer
- **Email:** bkostadinovic1990@gmail.com

---

## Hire Me

Need a custom prompt management tool or similar project?

**Upwork:** https://www.upwork.com/freelancers/~0131475cd060f3f7ea  
**Fiverr:** https://www.fiverr.com/b_kostadinovic  
**Email:** bkostadinovic1990@gmail.com

I specialize in:
- ✅ Browser-based tools (no backend needed)
- ✅ Data organization and management
- ✅ Clean, maintainable code
- ✅ User-friendly interfaces
- ✅ Export/import functionality

**Typical turnaround:** 2-3 days for tools like this

---

## License

MIT License - Free to use for personal and client projects