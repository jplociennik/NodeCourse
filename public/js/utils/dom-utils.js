// =============================================================================
// DOM UTILITIES MODULE
// General DOM manipulation functions for any type of items
// =============================================================================

// =============================================================================
// CONSTANTS
// =============================================================================

const DOM_SELECTORS = {
    SEARCH_INPUT: '#searchInput',
    SORT_SELECT: '#sortSelect'
};

// =============================================================================
// DOM QUERY FUNCTIONS
// =============================================================================

/**
 * Get all items by class
 * @param {string} itemClass - CSS class name
 * @returns {NodeList}
 */
const getAllItems = (itemClass) => {
    return document.querySelectorAll(`.${itemClass}`);
};

/**
 * Get visible items by class
 * @param {string} itemClass - CSS class name
 * @returns {NodeList}
 */
const getVisibleItems = (itemClass) => {
    return document.querySelectorAll(`.${itemClass}:not([style*="display: none"])`);
};

/**
 * Get text content from element within item
 * @param {HTMLElement} item - DOM element
 * @param {string} selector - CSS selector for child element
 * @returns {string}
 */
const getItemText = (item, selector) => {
    return item.querySelector(selector)?.textContent.trim() || '';
};

/**
 * Get attribute value from element within item
 * @param {HTMLElement} item - DOM element
 * @param {string} selector - CSS selector for child element
 * @param {string} attribute - Attribute name
 * @returns {string}
 */
const getItemAttribute = (item, selector, attribute) => {
    return item.querySelector(selector)?.getAttribute(attribute) || '';
};

/**
 * Check if checkbox within item is checked
 * @param {HTMLElement} item - DOM element
 * @param {string} selector - CSS selector for checkbox
 * @returns {boolean}
 */
const isItemChecked = (item, selector = 'input[type="checkbox"]') => {
    return item.querySelector(selector)?.checked || false;
};

// =============================================================================
// DOM MANIPULATION FUNCTIONS
// =============================================================================

/**
 * Show item
 * @param {HTMLElement} item - DOM element
 */
const showItem = (item) => {
    item.style.display = 'block';
};

/**
 * Hide item
 * @param {HTMLElement} item - DOM element
 */
const hideItem = (item) => {
    item.style.display = 'none';
};

/**
 * Show all items by class
 * @param {string} itemClass - CSS class name
 */
const showAllItems = (itemClass) => {
    const allItems = getAllItems(itemClass);
    allItems.forEach(showItem);
};

/**
 * Reset item ordering (remove order styles)
 * @param {string} itemClass - CSS class name
 */
const resetItemOrdering = (itemClass) => {
    const allItems = getAllItems(itemClass);
    allItems.forEach(item => {
        item.style.order = '';
    });
};

/**
 * Reorder DOM elements based on sorted array
 * @param {Array<HTMLElement>} sortedItems - Array of sorted items
 */
const reorderItems = (sortedItems) => {
    if (sortedItems.length === 0) return;
    
    const parent = sortedItems[0].parentNode;
    sortedItems.forEach(item => {
        parent.appendChild(item);
    });
};

// =============================================================================
// INPUT VALUE FUNCTIONS
// =============================================================================

/**
 * Get input value by ID
 * @param {string} inputId - Input element ID
 * @returns {string}
 */
const getInputValue = (inputId) => {
    const input = document.querySelector(`#${inputId}`);
    return input ? input.value.trim() : '';
};

/**
 * Get select value by ID
 * @param {string} selectId - Select element ID
 * @returns {string}
 */
const getSelectValue = (selectId) => {
    const select = document.querySelector(`#${selectId}`);
    return select ? select.value : '';
};

/**
 * Clear input value by ID
 * @param {string} inputId - Input element ID
 */
const clearInput = (inputId) => {
    const input = document.querySelector(`#${inputId}`);
    if (input) {
        input.value = '';
    }
};

/**
 * Clear select value by ID
 * @param {string} selectId - Select element ID
 */
const clearSelect = (selectId) => {
    const select = document.querySelector(`#${selectId}`);
    if (select) {
        select.value = '';
    }
};

// Convenience functions for common inputs
const getSearchInputValue = () => getInputValue('searchInput');
const getSortSelectValue = () => getSelectValue('sortSelect');
const clearSearchInput = () => clearInput('searchInput');
const clearSortSelect = () => clearSelect('sortSelect');

// =============================================================================
// URL MANAGEMENT FUNCTIONS
// =============================================================================

/**
 * Update URL with parameters
 * @param {Object} params - Object with parameter key-value pairs
 */
const updateURL = (params = {}) => {
    const urlParams = new URLSearchParams();
    
    // Add provided parameters
    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            urlParams.set(key, value);
        }
    });
    
    const currentPath = window.location.pathname;
    const newUrl = urlParams.toString() ? `${currentPath}?${urlParams.toString()}` : currentPath;
    history.replaceState(null, '', newUrl);
};

/**
 * Update URL with search and sort parameters
 * @param {string} searchValue - Search query
 * @param {string} sortValue - Sort option
 */
const updateSearchSortURL = (searchValue = '', sortValue = '') => {
    updateURL({
        q: searchValue,
        sort: sortValue
    });
};

// =============================================================================
// COUNTER FUNCTIONS
// =============================================================================

/**
 * Update counter element with item count
 * @param {string} itemClass - CSS class name of items to count
 * @param {string} counterSelector - CSS selector for counter element
 */
const updateItemCounter = (itemClass, counterSelector) => {
    const visibleItems = getVisibleItems(itemClass);
    const counterElement = document.querySelector(counterSelector);
    
    if (counterElement) {
        counterElement.textContent = visibleItems.length;
    }
    
    return visibleItems.length;
};

// =============================================================================
// INTERNAL MODULE API
// =============================================================================

// Export all functions as part of DOMUtils object for internal module use
const DOMUtils = {
    // Constants
    selectors: DOM_SELECTORS,
    
    // Query functions
    getAllItems,
    getVisibleItems,
    getItemText,
    getItemAttribute,
    isItemChecked,
    
    // Manipulation functions
    showItem,
    hideItem,
    showAllItems,
    resetItemOrdering,
    reorderItems,
    
    // Input functions
    getInputValue,
    getSelectValue,
    clearInput,
    clearSelect,
    getSearchInputValue,
    getSortSelectValue,
    clearSearchInput,
    clearSortSelect,
    
    // URL functions
    updateURL,
    updateSearchSortURL,
    
    // Counter functions
    updateItemCounter
};

// Export DOMUtils as default export
export default DOMUtils; 