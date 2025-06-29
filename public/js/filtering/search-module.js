import DOMUtils from '../utils/dom-utils.js';

/**
 * SearchModule - Handles search functionality
 * Works with FilterManager to avoid code duplication
 */
let searchModuleManager = null;
let searchModuleConfig = null;

const initSearchModule = (manager) => {
    searchModuleManager = manager;
    searchModuleConfig = manager.config.searchConfig;
};

const performSearch = (searchQuery, shouldUpdateURL = true) => {
    const searchValue = searchQuery.toLowerCase();
    
    // Get item class from config
    const itemClass = searchModuleManager.config.itemClass || 'col-md-6';
    const searchFields = searchModuleManager.config.searchFields || ['title'];
    
    // Get all items using DOMUtils
    const items = DOMUtils.getAllItems(itemClass);
    
    let matchedCount = 0;
    
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
                    textToSearch = DOMUtils.getItemAttribute(item, `[data-${attributeName}]`, `data-${attributeName}`) || '';
                } else {
                    // Search in element content (for tasks)
                    if (field === 'title') {
                        textToSearch = DOMUtils.getItemText(item, '.card-title');
                    }
                }
                
                if (textToSearch.toLowerCase().includes(searchValue)) {
                    matchesSearch = true;
                    break;
                }
            }
        }
        
        if (matchesSearch) {
            DOMUtils.showItem(item);
            matchedCount++;
        } else {
            DOMUtils.hideItem(item);
        }
    });
    
    if (shouldUpdateURL && searchModuleManager.updateURL) {
        searchModuleManager.updateURL();
    }
    if (shouldUpdateURL && searchModuleManager.updateCounts) {
        searchModuleManager.updateCounts();
    }
};

const clearSearch = () => {
    DOMUtils.clearSearchInput();
};

const getSearchModuleValue = () => {
    return DOMUtils.getSearchInputValue();
};

// Create SearchModule as an object with arrow functions
const SearchModule = function(manager) {
    initSearchModule(manager);
    
    return {
        performSearch,
        clear: clearSearch,
        getValue: getSearchModuleValue
    };
};

// Export as default
export default SearchModule; 