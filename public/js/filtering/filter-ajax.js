// AJAX filtering for smooth user experience - Functional approach
import { onReady, d, debounce } from '../utils/helpers.js';
import { makeAjaxRequest } from './ajax-requests.js';
import { updateContent } from './content-updater.js';
import { initializeAdvancedFilters } from './advanced-filter.js';
import { handlePaginationAction } from './pagination-handler.js';
import { handleLimitChange } from './limit-handler.js';
import { handleFilterSubmit, handleClearFilters } from './filter-handlers.js';

// =============================================================================
// INITIALIZATION FUNCTION
// =============================================================================

/**
 * Initializes filter AJAX functionality
 */
const initializeFilterAjax = () => {
    const form = d.querySelector('#filterForm');
    if (!form) return;
    
    // Initialize advanced filters
    initializeAdvancedFilters();
    
    // Create a single debounced function for all filter actions
    const debouncedFilterSubmit = debounce(handleFilterSubmit(form), 300);
    
    // Handle search button click
    const searchBtn = d.querySelector('#searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', debouncedFilterSubmit);
    }
    
    // Handle apply filters button click
    const applyFiltersBtn = d.querySelector('#applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', debouncedFilterSubmit);
    }
    
    // Handle clear filters button
    const clearFiltersBtn = d.querySelector('#clearFiltersBtn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', handleClearFilters(form));
    }
    
    // Handle search input enter key
    const searchInput = d.querySelector('#searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                debouncedFilterSubmit();
            }
        });
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', async (event) => {
        try {
            const url = window.location.href;
            const html = await makeAjaxRequest(url);
            updateContent(html);
        } catch (error) {
            console.error('Error handling popstate:', error);
            window.location.reload();
        }
    });
};

// =============================================================================
// EXPORTS FOR EVENT DELEGATION
// =============================================================================

export { handlePaginationAction, handleLimitChange, handleFilterSubmit };

// =============================================================================
// INITIALIZATION
// =============================================================================

onReady(initializeFilterAjax); 