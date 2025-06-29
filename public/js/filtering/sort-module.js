import DOMUtils from '../utils/dom-utils.js';

/**
 * SortModule - Handles sort functionality
 * Works with FilterManager to avoid code duplication
 */
let sortModuleManager = null;
let sortModuleConfig = null;

const initSortModule = (manager) => {
    sortModuleManager = manager;
    sortModuleConfig = manager.config.sortConfig;
};

const performSort = (sortValue, shouldUpdateURL = true) => {
    if (!sortValue) {
        clearSort();
        return;
    }
    
    const [field, direction] = sortValue.split('|');
    
    // Get container class and item class from config
    const itemClass = sortModuleManager.config.itemClass || 'col-md-6';
    
    // Get visible items using DOMUtils
    const visibleItems = Array.from(DOMUtils.getVisibleItems(itemClass));
    
    if (visibleItems.length === 0) return;
    
    // Sort visible items - always use task-specific logic for reliability
    visibleItems.sort((a, b) => {
        let valueA, valueB;
        
        switch (field) {
            case 'taskName':
                valueA = DOMUtils.getItemText(a, '.card-title').toLowerCase();
                valueB = DOMUtils.getItemText(b, '.card-title').toLowerCase();
                break;
            case 'dateFrom':
                // Look for date in task meta or data attributes
                const metaA = DOMUtils.getItemText(a, '.task-meta');
                const metaB = DOMUtils.getItemText(b, '.task-meta');
                const dateA = metaA.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '';
                const dateB = metaB.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '';
                valueA = dateA ? new Date(dateA) : new Date(0);
                valueB = dateB ? new Date(dateB) : new Date(0);
                break;
            case 'isDone':
                valueA = DOMUtils.isItemChecked(a, 'input[type="checkbox"]') ? 1 : 0;
                valueB = DOMUtils.isItemChecked(b, 'input[type="checkbox"]') ? 1 : 0;
                break;
            default:
                console.warn('Unknown sort field:', field);
                return 0;
        }
        
        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    // Reorder DOM elements using DOMUtils
    DOMUtils.reorderItems(visibleItems);
    
    if (shouldUpdateURL && sortModuleManager.updateURL) {
        sortModuleManager.updateURL();
    }
    if (shouldUpdateURL && sortModuleManager.updateCounts) {
        sortModuleManager.updateCounts();
    }
};

const clearSort = () => {
    DOMUtils.clearSortSelect();
    
    // Reset CSS ordering using DOMUtils
    const itemClass = sortModuleManager.config.itemClass || 'col-md-6';
    DOMUtils.resetItemOrdering(itemClass);
};

const getSortModuleValue = () => {
    return DOMUtils.getSortSelectValue();
};

// Create SortModule as an object with arrow functions
const SortModule = function(manager) {
    initSortModule(manager);
    
    return {
        performSort,
        clear: clearSort,
        getValue: getSortModuleValue
    };
};

// Export as default
export default SortModule; 