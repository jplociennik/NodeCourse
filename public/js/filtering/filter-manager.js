import { d } from '../utils/helpers.js';
import DOMUtils from '../utils/dom-utils.js';
import { StatisticsUtils } from '../utils/statistics.js';
import { CSS_CLASSES } from '../utils/helpers.js';

/**
 * FilterManager - Handles unified filtering system
 * Dynamically loads and manages search, sort, and advanced filter modules
 */

// =============================================================================
// CONSTANTS
// =============================================================================

const FEATURE_NAMES = {
    SEARCH: 'search',
    SORT: 'sort',
    ADVANCED_FILTERS: 'advancedFilters'
};

// =============================================================================
// MODULE VARIABLES
// =============================================================================

let SearchModule, SortModule, FilterModule;
let filterManagerConfig = {};
let filterManagerModules = {};

// =============================================================================
// INITIALIZATION FUNCTIONS
// =============================================================================

const initFilterManager = (config = {}) => {
    filterManagerConfig = {
        features: [FEATURE_NAMES.SEARCH, FEATURE_NAMES.SORT, FEATURE_NAMES.ADVANCED_FILTERS],
        itemClass: CSS_CLASSES.TASK_ITEM,
        searchFields: ['title'],
        ...config
    };
    
    filterManagerModules = {};
};

const init = async () => {
    try {
        // Import modules dynamically
        if (hasFeature(FEATURE_NAMES.SEARCH)) {
            const { default: SearchModuleClass } = await import('./search-module.js');
            SearchModule = SearchModuleClass;
        }     
        if (hasFeature(FEATURE_NAMES.SORT)) {
            const { default: SortModuleClass } = await import('./sort-module.js');
            SortModule = SortModuleClass;
        }      
        if (hasFeature(FEATURE_NAMES.ADVANCED_FILTERS)) {
            const { default: FilterModuleClass } = await import('./filter-module.js');
            FilterModule = FilterModuleClass;
        }
        
        const managerInterface = getFilterManagerInterface();
        
        // Initialize modules if enabled
        if (hasFeature(FEATURE_NAMES.SEARCH) && SearchModule) {
            filterManagerModules.search = SearchModule(managerInterface);
        }     
        if (hasFeature(FEATURE_NAMES.SORT) && SortModule) {
            filterManagerModules.sort = SortModule(managerInterface);
        }     
        if (hasFeature(FEATURE_NAMES.ADVANCED_FILTERS) && FilterModule) {
            filterManagerModules.advancedFilters = FilterModule(managerInterface);
        }
        
        setupFilterEventListeners();
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

// =============================================================================
// CORE FILTERING FUNCTIONS
// =============================================================================

const search = (query = null) => {
    if (!hasFeature(FEATURE_NAMES.SEARCH)) return;
    
    const searchQuery = query || getSearchValue();
    filterManagerModules.search?.performSearch(searchQuery);
    updateManagerURL();
    updateCounts();
};

const sort = (sortValue = null) => {
    if (!hasFeature(FEATURE_NAMES.SORT)) return;
    
    const sortOption = sortValue || getSortValue();
    filterManagerModules.sort?.performSort(sortOption);
    updateManagerURL();
};

const applyAllFilters = () => {
    const searchQuery = getSearchValue();
    const sortOption = getSortValue();
    
    if (!searchQuery && !sortOption) {
        showAllTasks();
        updateManagerURL();
        updateCounts();
        return;
    }
    
    showAllTasks();
    
    if (hasFeature(FEATURE_NAMES.SEARCH) && searchQuery) {
        filterManagerModules.search?.performSearch(searchQuery, false);
    }
    
    if (hasFeature(FEATURE_NAMES.SORT) && sortOption) {
        filterManagerModules.sort?.performSort(sortOption, false);
    }
    
    updateManagerURL();
    updateCounts();
};

const clearAll = () => {
    if (hasFeature(FEATURE_NAMES.SEARCH)) {
        filterManagerModules.search?.clear();
    }
    
    if (hasFeature(FEATURE_NAMES.SORT)) {
        filterManagerModules.sort?.clear();
    }
    
    resetToCleanState();
    updateManagerURL();
    updateCounts();
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getSearchValue = () => {
    return DOMUtils.getSearchInputValue();
};

const getSortValue = () => {
    return DOMUtils.getSortSelectValue();
};

const resetToCleanState = () => {
    showAllTasks();
};

const showAllTasks = () => {
    const itemClass = filterManagerConfig.itemClass || CSS_CLASSES.TASK_ITEM;
    DOMUtils.showAllItems(itemClass);
};

// =============================================================================
// URL & STATE MANAGEMENT
// =============================================================================

const updateManagerURL = () => {
    const searchValue = getSearchValue();
    const sortValue = getSortValue();
    
    DOMUtils.updateSearchSortURL(searchValue, sortValue);
};

const updateCounts = () => {
    const itemClass = filterManagerConfig.itemClass || CSS_CLASSES.TASK_ITEM;
    
    StatisticsUtils.updateStatistics();
};

const initializeFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const searchValue = urlParams.get('q') || '';
    const searchInput = d.querySelector('#searchInput');
    if (searchInput && searchValue) {
        searchInput.value = searchValue;
    }
    
    const sortValue = urlParams.get('sort') || '';
    const sortSelect = d.querySelector('#sortSelect');
    if (sortSelect && sortValue) {
        sortSelect.value = sortValue;
    }
    
    if (searchValue || sortValue) {
        applyAllFilters();
    } else {
        updateCounts();
    }
};

// =============================================================================
// EVENT LISTENERS
// =============================================================================

const setupFilterEventListeners = () => {
    const searchInput = d.querySelector('#searchInput');
    if (searchInput && hasFeature(FEATURE_NAMES.SEARCH)) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyAllFilters();
            }
        });
    }

    // Add event listeners for filter buttons
    d.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]')?.dataset.action;
        
        if (action === 'apply-filters') {
            e.preventDefault();
            if (hasFeature(FEATURE_NAMES.ADVANCED_FILTERS)) {
                filterManagerModules.advancedFilters?.applyFilters();
            } else {
                applyAllFilters();
            }
        } else if (action === 'clear-filters') {
            e.preventDefault();
            if (hasFeature(FEATURE_NAMES.ADVANCED_FILTERS)) {
                filterManagerModules.advancedFilters?.clear();
            } else {
                clearAll();
            }
        }
    });
};

// =============================================================================
// MODULE INTERFACE & EXPORT
// =============================================================================

const getFilterManagerInterface = () => ({
    config: filterManagerConfig,
    modules: filterManagerModules,
    updateURL: updateManagerURL,
    updateCounts
});

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

export { FilterManager };
export default FilterManager; 