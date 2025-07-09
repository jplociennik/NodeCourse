import { d, onReady, CSS_CLASSES } from '../utils/helpers.js';
import DOMUtils from '../utils/dom-utils.js';
import { StatisticsUtils } from '../utils/statistics.js';

/**
 * Applies search and sort filters without page reload
 */
const applyFilters = () => {
    const searchValue = DOMUtils.getSearchInputValue();
    const sortValue = DOMUtils.getSortSelectValue();
    
    // Get all task cards and show them initially
    const tasks = d.querySelectorAll(`.${CSS_CLASSES.TASK_ITEM}`);
    DOMUtils.showAllItems(CSS_CLASSES.TASK_ITEM);
    
    // Apply search filter if search value exists
    if (searchValue) {
        tasks.forEach(task => {
            const title = DOMUtils.getItemText(task, '.card-title');
            if (!title.toLowerCase().includes(searchValue.toLowerCase())) {
                DOMUtils.hideItem(task);
            }
        });
    }
    
    // Apply sort to visible tasks if sort value exists
    if (sortValue) {
        const visibleTasks = Array.from(tasks).filter(task => task.style.display !== 'none');
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
            
            return direction === 'asc' 
                ? (valueA < valueB ? -1 : valueA > valueB ? 1 : 0)
                : (valueA > valueB ? -1 : valueA < valueB ? 1 : 0);
        });
        
        DOMUtils.reorderItems(visibleTasks);
    }
    
    // Update URL and statistics
    DOMUtils.updateSearchSortURL(searchValue, sortValue);
    StatisticsUtils.updateTaskCount();
    StatisticsUtils.updateStatistics();
};

/**
 * Clears all filters without page reload
 */
const clearFilters = () => {
    DOMUtils.clearSearchInput();
    DOMUtils.clearSortSelect();
    DOMUtils.showAllItems(CSS_CLASSES.TASK_ITEM);
    DOMUtils.resetItemOrdering(CSS_CLASSES.TASK_ITEM);
    DOMUtils.updateSearchSortURL('', '');
    StatisticsUtils.updateTaskCount();
    StatisticsUtils.updateStatistics();
};

/**
 * Initialize filters from URL parameters on page load
 */
const initializeFiltersFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Set search and sort values from URL
    const searchValue = urlParams.get('q') || '';
    const sortValue = urlParams.get('sort') || '';
    
    if (searchValue) d.querySelector('#searchInput').value = searchValue;
    if (sortValue) d.querySelector('#sortSelect').value = sortValue;
    
    // Apply filters if parameters exist, otherwise just update statistics
    if (searchValue || sortValue) {
        applyFilters();
    } else {
        StatisticsUtils.updateTaskCount();
        StatisticsUtils.updateStatistics();
    }
};

// Export for module usage
export { applyFilters, clearFilters, initializeFiltersFromURL };

// Initialize from URL when page loads
onReady(() => {
    initializeFiltersFromURL();
}); 