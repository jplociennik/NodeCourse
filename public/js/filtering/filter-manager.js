import { d } from '../utils/helpers.js';
import DOMUtils from '../utils/dom-utils.js';
import { StatisticsUtils } from '../utils/statistics.js';

/**
 * FilterManager - Coordinates search, sort, and advanced filtering
 * Replaces individual classes with arrow function modules
 */

let SearchModule, SortModule, FilterModule;
let filterManagerConfig = {};
let filterManagerModules = {};

const initFilterManager = (config = {}) => {
    filterManagerConfig = {
        features: ['search', 'sort'], // default features
        itemClass: 'col-md-6', // default item class
        searchFields: ['title'], // default search fields
        ...config
    };
    
    // Initialize modules based on enabled features
    filterManagerModules = {};
};

const init = async () => {
    try {
        // Import modules dynamically
        if (hasFeature('search')) {
            const { default: SearchModuleClass } = await import('./search-module.js');
            SearchModule = SearchModuleClass;
        }
        
        if (hasFeature('sort')) {
            const { default: SortModuleClass } = await import('./sort-module.js');
            SortModule = SortModuleClass;
        }
        
        if (hasFeature('advancedFilters')) {
            const { default: FilterModuleClass } = await import('./filter-module.js');
            FilterModule = FilterModuleClass;
        }
        
        const managerInterface = getFilterManagerInterface();
        
        // Initialize search module if enabled
        if (hasFeature('search') && SearchModule) {
            filterManagerModules.search = SearchModule(managerInterface);
        }
        
        // Initialize sort module if enabled  
        if (hasFeature('sort') && SortModule) {
            filterManagerModules.sort = SortModule(managerInterface);
        }
        
        // Initialize advanced filters if enabled
        if (hasFeature('advancedFilters') && FilterModule) {
            filterManagerModules.advancedFilters = FilterModule(managerInterface);
        }
        
        // Set up event listeners
        setupFilterEventListeners();
        
        // Initialize from URL parameters
        initializeFromURL();
        
        console.log('FilterManager initialized successfully');
        
        return true;
    } catch (error) {
        console.error('FilterManager initialization failed:', error);
        return false;
    }
};

const hasFeature = (feature) => {
    return filterManagerConfig.features.includes(feature);
};

const search = (query = null) => {
    if (!hasFeature('search')) return;
    
    const searchQuery = query || getSearchValue();
    filterManagerModules.search?.performSearch(searchQuery);
    updateManagerURL();
    updateCounts();
};

const sort = (sortValue = null) => {
    if (!hasFeature('sort')) return;
    
    const sortOption = sortValue || getSortValue();
    filterManagerModules.sort?.performSort(sortOption);
    updateManagerURL();
};

const applyAllFilters = () => {
    // Apply all enabled filters in correct order
    const searchQuery = getSearchValue();
    const sortOption = getSortValue();
    
    // If no filters are specified, just ensure all tasks are visible
    if (!searchQuery && !sortOption) {
        showAllTasks();
        updateManagerURL();
        updateCounts();
        return;
    }
    
    // Reset to clean state before applying filters
    showAllTasks();
    
    // First filter by search
    if (hasFeature('search') && searchQuery) {
        filterManagerModules.search?.performSearch(searchQuery, false); // false = don't update URL yet
    }
    
    // Then sort visible results (only if we have visible tasks)
    if (hasFeature('sort') && sortOption) {
        filterManagerModules.sort?.performSort(sortOption, false); // false = don't update URL yet
    }
    
    updateManagerURL();
    updateCounts();
};

const clearAll = () => {
    // Clear all inputs
    if (hasFeature('search')) {
        filterManagerModules.search?.clear();
    }
    
    if (hasFeature('sort')) {
        filterManagerModules.sort?.clear();
    }
    
    // Reset to clean state
    resetToCleanState();
    updateManagerURL();
    updateCounts();
};

// Helper methods - now using DOMUtils
const getSearchValue = () => {
    return DOMUtils.getSearchInputValue();
};

const getSortValue = () => {
    return DOMUtils.getSortSelectValue();
};

// Simple helper - just show all tasks without DOM manipulation
const resetToCleanState = () => {
    showAllTasks();
};

const showAllTasks = () => {
    const itemClass = filterManagerConfig.itemClass || 'col-md-6';
    DOMUtils.showAllItems(itemClass);
};

const updateManagerURL = () => {
    const searchValue = getSearchValue();
    const sortValue = getSortValue();
    
    // Use DOMUtils for URL updating
    DOMUtils.updateSearchSortURL(searchValue, sortValue);
};

const updateCounts = () => {
    // Update task count and statistics using the statistics module
    StatisticsUtils.updateStatistics();
};

const initializeFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Set search value
    const searchValue = urlParams.get('q') || '';
    const searchInput = d.querySelector('#searchInput');
    if (searchInput && searchValue) {
        searchInput.value = searchValue;
    }
    
    // Set sort value
    const sortValue = urlParams.get('sort') || '';
    const sortSelect = d.querySelector('#sortSelect');
    if (sortSelect && sortValue) {
        sortSelect.value = sortValue;
    }
    
    // Apply filters if there are parameters
    if (searchValue || sortValue) {
        applyAllFilters();
    } else {
        // Even if no filters, update counts to get correct initial statistics
        updateCounts();
    }
};

const setupFilterEventListeners = () => {
    // Only add Enter key listener for search input
    const searchInput = d.querySelector('#searchInput');
    if (searchInput && hasFeature('search')) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyAllFilters(); // Use applyFilters instead of search to handle both search and sort
            }
        });
    }
    
    // No automatic listeners for sort select - only manual button clicks
};

// Interface object to pass to modules
const getFilterManagerInterface = () => ({
    config: filterManagerConfig,
    modules: filterManagerModules,
    updateURL: updateManagerURL,
    updateCounts
});

// Create FilterManager as a function that returns an object with arrow functions
const FilterManager = function(config = {}) {
    initFilterManager(config);
    
    return {
        init,
        hasFeature,
        search,
        sort,
        applyFilters: applyAllFilters,
        clearAll,
        getSearchValue,
        getSortValue,
        updateURL: updateManagerURL,
        updateCounts,
        modules: filterManagerModules
    };
};

// All global functions removed - using universal event delegation system instead!
// No more window pollution needed

// Export FilterManager and global functions
export { FilterManager };
export default FilterManager; 