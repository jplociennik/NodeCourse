import DOMUtils from '../utils/dom-utils.js';
import { CSS_CLASSES } from '../utils/helpers.js';

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

/**
 * Gets the text to search from an item based on field configuration
 */
const getTextToSearch = (item, field) => {
    if (field.startsWith('data-')) {
        const attributeName = field.replace('data-', '');
        return DOMUtils.getItemAttribute(item, `[data-${attributeName}]`, `data-${attributeName}`) || '';
    } else {
        if (field === 'title') {
            return DOMUtils.getItemText(item, '.card-title');
        }
    }
    return '';
};

/**
 * Checks if a single item matches the search query
 */
const checkItemMatch = (item, searchValue, searchFields) => {
    if (!searchValue) return true;
    
    for (const field of searchFields) {
        const textToSearch = getTextToSearch(item, field);  
        if (textToSearch.toLowerCase().includes(searchValue)) 
            return true;     
    } 
    return false;
};

/**
 * Processes search results by showing/hiding items and counting matches
 */
const processSearchResults = (items, searchValue, searchFields) => {
    let matchedCount = 0;
    
    items.forEach(item => {
        const matchesSearch = checkItemMatch(item, searchValue, searchFields);
        
        if (matchesSearch) {
            DOMUtils.showItem(item);
            matchedCount++;
        } else 
            DOMUtils.hideItem(item);
    });
    return matchedCount;
};

/**
 * Updates URL and counts if needed
 */
const updateSearchState = (shouldUpdateURL) => {
    if (shouldUpdateURL && searchModuleManager.updateURL) 
        searchModuleManager.updateURL();

    if (shouldUpdateURL && searchModuleManager.updateCounts) 
        searchModuleManager.updateCounts();
};

const performSearch = (searchQuery, shouldUpdateURL = true) => {
    const searchValue = searchQuery.toLowerCase();
    const itemClass = searchModuleManager.config.itemClass || CSS_CLASSES.TASK_ITEM;
    const searchFields = searchModuleManager.config.searchFields || ['title'];
    const items = DOMUtils.getAllItems(itemClass);
    const matchedCount = processSearchResults(items, searchValue, searchFields);
    
    updateSearchState(shouldUpdateURL);
    return matchedCount;
};

const clearSearch = () => {
    // Clear input
    DOMUtils.clearSearchInput();
    
    // Show all items
    const itemClass = searchModuleManager.config.itemClass || CSS_CLASSES.TASK_ITEM;
    const items = DOMUtils.getAllItems(itemClass);
    items.forEach(item => DOMUtils.showItem(item));
    
    // Update state
    updateSearchState(true);
};

const getSearchModuleValue = () => {
    return DOMUtils.getSearchInputValue();
};

const SearchModule = (manager) => {
    initSearchModule(manager);
    
    return {
        performSearch,
        clear: clearSearch,
        getValue: getSearchModuleValue
    };
};

export default SearchModule; 