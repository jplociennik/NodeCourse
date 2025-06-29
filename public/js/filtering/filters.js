import { d, onReady } from '../utils/helpers.js';
import DOMUtils from '../utils/dom-utils.js';
import { StatisticsUtils } from '../utils/statistics.js';

// Search and Sort functionality for tasks page - Client-side filtering

/**
 * Applies search and sort filters without page reload
 */
const applyFilters = () => {
    const searchValue = getFallbackSearchValue();
    const sortValue = getFallbackSortValue();
    
    // Get all task cards
    const tasks = d.querySelectorAll('.col-md-6');
    
    // First, show all tasks
    DOMUtils.showAllItems('col-md-6');
    
    // Apply search filter
    if (searchValue) {
        tasks.forEach(task => {
            const title = DOMUtils.getItemText(task, '.card-title');
            if (!title.toLowerCase().includes(searchValue.toLowerCase())) {
                DOMUtils.hideItem(task);
            }
        });
    }
    
    // Apply sort to visible tasks
    if (sortValue) {
        const visibleTasks = Array.from(tasks).filter(task => 
            task.style.display !== 'none'
        );
        
        const [field, direction] = sortValue.split('|');
        
        visibleTasks.sort((a, b) => {
            let valueA, valueB;
            
            switch (field) {
                case 'taskName':
                    valueA = DOMUtils.getItemText(a, '.card-title').toLowerCase();
                    valueB = DOMUtils.getItemText(b, '.card-title').toLowerCase();
                    break;
                case 'dateFrom':
                    const metaA = DOMUtils.getItemText(a, '.task-meta');
                    const metaB = DOMUtils.getItemText(b, '.task-meta');
                    const dateA = metaA.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '';
                    const dateB = metaB.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '';
                    valueA = dateA ? new Date(dateA) : new Date(0);
                    valueB = dateB ? new Date(dateB) : new Date(0);
                    break;
                case 'isDone':
                    valueA = DOMUtils.isItemChecked(a) ? 1 : 0;
                    valueB = DOMUtils.isItemChecked(b) ? 1 : 0;
                    break;
                default:
                    return 0;
            }
            
            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        
        // Reorder DOM elements using DOMUtils
        DOMUtils.reorderItems(visibleTasks);
    }
    
    // Update URL and counts
    updateURL(searchValue, sortValue);
    StatisticsUtils.updateTaskCount();
    StatisticsUtils.updateStatistics();
};

/**
 * Clears all filters without page reload
 */
const clearFilters = () => {
    // Clear all inputs
    DOMUtils.clearSearchInput();
    DOMUtils.clearSortSelect();
    
    // Show all tasks and reset ordering
    DOMUtils.showAllItems('col-md-6');
    DOMUtils.resetItemOrdering('col-md-6');
    
    // Update URL and counts
    updateURL('', '');
    StatisticsUtils.updateTaskCount(); 
    StatisticsUtils.updateStatistics();
};

const getFallbackSearchValue = () => {
    return DOMUtils.getSearchInputValue();
};

const getFallbackSortValue = () => {
    return DOMUtils.getSortSelectValue();
};

/**
 * Updates URL without page reload
 */
const updateURL = (searchValue, sortValue) => {
    DOMUtils.updateSearchSortURL(searchValue, sortValue);
};

// Removed updateTaskCount function to avoid conflicts - use StatisticsUtils.updateTaskCount() directly

/**
 * Initialize filters from URL parameters on page load
 */
const initializeFiltersFromURL = () => {
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
        applyFilters();
    } else {
        // Even if no filters, update counts to get correct initial statistics
        StatisticsUtils.updateTaskCount();
        StatisticsUtils.updateStatistics();
    }
};

// Export for module usage
export { applyFilters, clearFilters, initializeFiltersFromURL };

// No more window.* fallback functions needed - using universal event delegation system

// Initialize from URL when page loads
onReady(() => {
    initializeFiltersFromURL();
}); 