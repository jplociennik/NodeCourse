/**
 * SearchModule - Handles search functionality
 * Works with FilterManager to avoid code duplication
 */
class SearchModule {
    constructor(manager) {
        this.manager = manager;
        this.config = manager.config.searchConfig;
    }
    
    performSearch(searchQuery, shouldUpdateURL = true) {
        const searchValue = searchQuery.toLowerCase();
        
        // Get item class from config
        const itemClass = this.manager.config.itemClass || 'col-md-6';
        const searchFields = this.manager.config.searchFields || ['data-name'];
        
        // Get all items
        const items = document.querySelectorAll(`.${itemClass}`);
        
        // Filter items based on search
        items.forEach(item => {
            let matchesSearch = false;
            
            if (!searchValue) {
                matchesSearch = true;
            } else {
                // Check each configured search field
                for (const field of searchFields) {
                    let textToSearch = '';
                    
                    if (field.startsWith('data-')) {
                        // Search in data attribute
                        const attributeName = field.replace('data-', '');
                        textToSearch = item.getAttribute(`data-${attributeName}`) || '';
                    } else {
                        // Search in element content (fallback for tasks)
                        if (field === 'title') {
                            textToSearch = item.querySelector('.card-title')?.textContent.trim() || '';
                        }
                    }
                    
                    if (textToSearch.toLowerCase().includes(searchValue)) {
                        matchesSearch = true;
                        break;
                    }
                }
            }
            
            item.style.display = matchesSearch ? 'block' : 'none';
        });
        
        if (shouldUpdateURL) {
            this.manager.updateURL();
            this.manager.updateCounts();
        }
    }
    
    clear() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
    }
    
    getValue() {
        const searchInput = document.getElementById('searchInput');
        return searchInput ? searchInput.value.trim() : '';
    }
} 