/**
 * FilterManager - Main class for coordinating search, sort, and filter functionality
 * Avoids code duplication and manages component interactions
 */
class FilterManager {
    constructor(config = {}) {
        this.config = {
            features: config.features || [], // ['search', 'sort', 'filter']
            searchConfig: config.searchConfig || {},
            sortConfig: config.sortConfig || {},
            filterConfig: config.filterConfig || {},
            ...config
        };
        
        this.modules = {};
        this.isInitialized = false;
        // Removed complex DOM ordering - keeping it simple
        
        this.init();
    }
    
    async init() {
        if (this.isInitialized) return;
        
        // Load required modules based on enabled features
        if (this.hasFeature('search')) {
            this.modules.search = new SearchModule(this);
        }
        
        if (this.hasFeature('sort')) {
            this.modules.sort = new SortModule(this);
        }
        
        if (this.hasFeature('filter')) {
            this.modules.filter = new FilterModule(this);
        }
        
        // Simple initialization - no complex DOM manipulation
        
        // Initialize URL state
        this.initializeFromURL();
        
        // Setup event listeners
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('FilterManager initialized with features:', this.config.features);
    }
    
    hasFeature(feature) {
        return this.config.features.includes(feature);
    }
    
    // Main action methods - delegates to appropriate modules
    search(query = null) {
        if (!this.hasFeature('search')) return;
        
        const searchQuery = query || this.getSearchValue();
        this.modules.search?.performSearch(searchQuery);
        this.updateURL();
        this.updateCounts();
    }
    
    sort(sortValue = null) {
        if (!this.hasFeature('sort')) return;
        
        const sortOption = sortValue || this.getSortValue();
        this.modules.sort?.performSort(sortOption);
        this.updateURL();
    }
    
    applyFilters() {
        // Apply all enabled filters in correct order
        const searchQuery = this.getSearchValue();
        const sortOption = this.getSortValue();
        
        console.log('ApplyFilters called:', { searchQuery, sortOption });
        
        // If no filters are specified, just ensure all tasks are visible
        if (!searchQuery && !sortOption) {
            this.showAllTasks();
            this.updateURL();
            this.updateCounts();
            return;
        }
        
        // Reset to clean state before applying filters
        this.showAllTasks();
        
        // First filter by search
        if (this.hasFeature('search') && searchQuery) {
            this.modules.search?.performSearch(searchQuery, false); // false = don't update URL yet
        }
        
        // Then sort visible results (only if we have visible tasks)
        if (this.hasFeature('sort') && sortOption) {
            this.modules.sort?.performSort(sortOption, false); // false = don't update URL yet
        }
        
        this.updateURL();
        this.updateCounts();
    }
    
    clearAll() {
        // Clear all inputs
        if (this.hasFeature('search')) {
            this.modules.search?.clear();
        }
        
        if (this.hasFeature('sort')) {
            this.modules.sort?.clear();
        }
        
        // Reset to clean state
        this.resetToCleanState();
        this.updateURL();
        this.updateCounts();
    }
    
    // Helper methods
    getSearchValue() {
        const input = document.getElementById('searchInput');
        return input ? input.value.trim() : '';
    }
    
    getSortValue() {
        const select = document.getElementById('sortSelect');
        return select ? select.value : '';
    }
    
    // Simple helper - just show all tasks without DOM manipulation
    resetToCleanState() {
        this.showAllTasks();
    }
    
    showAllTasks() {
        const itemClass = this.config.itemClass || 'col-md-6';
        const allItems = document.querySelectorAll(`.${itemClass}`);
        allItems.forEach(item => {
            item.style.display = 'block';
        });
    }
    
    updateURL() {
        const params = new URLSearchParams();
        
        const searchValue = this.getSearchValue();
        if (searchValue) {
            params.set('q', searchValue);
        }
        
        const sortValue = this.getSortValue();
        if (sortValue) {
            params.set('sort', sortValue);
        }
        
        const currentPath = window.location.pathname;
        const newUrl = params.toString() ? `${currentPath}?${params.toString()}` : currentPath;
        history.replaceState(null, '', newUrl);
    }
    
    updateCounts() {
        // Update task count - use configured item class
        const itemClass = this.config.itemClass || 'col-md-6';
        const visibleItems = document.querySelectorAll(`.${itemClass}:not([style*="display: none"])`);
        const taskCountBadge = document.querySelector('.task-count');
        
        if (taskCountBadge) {
            taskCountBadge.textContent = visibleItems.length;
        }
        
        // Update statistics if function exists
        if (typeof updateStatistics === 'function') {
            updateStatistics();
        }
    }
    
    initializeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Set search value
        const searchValue = urlParams.get('q') || '';
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchValue) {
            searchInput.value = searchValue;
        }
        
        // Set sort value
        const sortValue = urlParams.get('sort') || '';
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect && sortValue) {
            sortSelect.value = sortValue;
        }
        
        // Apply filters if there are parameters
        if (searchValue || sortValue) {
            this.applyFilters();
        } else {
            // Even if no filters, update counts to get correct initial statistics
            this.updateCounts();
        }
    }
    
    setupEventListeners() {
        // Search input enter key
        const searchInput = document.getElementById('searchInput');
        if (searchInput && this.hasFeature('search')) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.search();
                }
            });
        }
    }
}

// Global methods for compatibility with existing buttons
window.performSearch = function() {
    if (window.filterManager) {
        window.filterManager.search();
    }
};

window.performSort = function() {
    if (window.filterManager) {
        window.filterManager.sort();
    }
};

window.applyFilters = function() {
    if (window.filterManager) {
        window.filterManager.applyFilters();
    }
};

window.clearFilters = function() {
    if (window.filterManager) {
        window.filterManager.clearAll();
    }
};

window.clearSort = window.clearFilters; 