// AJAX filtering for smooth user experience - Functional approach
import { onReady, d, debounce } from '../utils/helpers.js';
import { updateURL } from '../utils/dom-utils.js';
import { saveScrollPosition, restoreScrollPosition } from '../utils/scroll-manager.js';
import { 
    initializeAdvancedFilters,
    clearAdvancedFilters
} from './advanced-filter.js';

// =============================================================================
// CONSTANTS
// =============================================================================

const LOADING_DELAY = 2000;

const LOADING_HTML = `
    <div class="col-12 text-center py-5">
        <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Ładowanie...</span>
        </div>
        <p class="mt-2">Wyszukiwanie...</p>
    </div>
`;

// =============================================================================
// LOADING STATE FUNCTIONS
// =============================================================================

const showLoading = () => {
    const tasksContainer = d.querySelector('.tasks-container');
    if (tasksContainer) {
        tasksContainer.innerHTML = LOADING_HTML;
    }
};

// =============================================================================
// CONTENT UPDATE FUNCTIONS
// =============================================================================

const updateContent = (html) => {
    const tempDiv = d.createElement('div');
    tempDiv.innerHTML = html;
    
    // Podmień statystyki na te z backendu
    const newStatistics = tempDiv.querySelector('.statistics-row');
    const currentStatisticsRow = d.querySelector('.statistics-row');
    if (currentStatisticsRow && newStatistics) {
        currentStatisticsRow.innerHTML = newStatistics.innerHTML;
    } else if (currentStatisticsRow) {
        currentStatisticsRow.innerHTML = '';
    }
    
    // Extract tasks container content or empty state
    const newTasksContainer = tempDiv.querySelector('.tasks-container');
    const newEmptyState = tempDiv.querySelector('.empty-state');
    const newPagination = tempDiv.querySelector('.pagination-container');
    
    // Update task count badge
    const newTaskCountElement = tempDiv.querySelector('#taskCount');
    const currentTaskCountElement = d.querySelector('#taskCount');
    if (newTaskCountElement && currentTaskCountElement) {
        currentTaskCountElement.textContent = newTaskCountElement.textContent;
    }
    
    // Update tasks container
    const tasksContainer = d.querySelector('.tasks-container');
    if (tasksContainer) {
        if (newTasksContainer) {
            tasksContainer.innerHTML = newTasksContainer.innerHTML;
        } else if (newEmptyState) {
            tasksContainer.innerHTML = newEmptyState.outerHTML;
        }
    }
    
    // Update pagination and results info (now combined in one element)
    const currentPagination = d.querySelector('.pagination-container');
    
    if (newPagination) {
        if (currentPagination) {
            // Update existing pagination (which now includes results info)
            currentPagination.innerHTML = newPagination.innerHTML;
        } else {
            // Insert new pagination after tasks container
            const tasksContainer = d.querySelector('.tasks-container');
            if (tasksContainer) {
                tasksContainer.parentNode.insertBefore(newPagination, tasksContainer.nextSibling);
            }
        }
    } else {
        // Remove current pagination if no pagination in response (e.g., when no tasks)
        if (currentPagination) {
            currentPagination.remove();
        }
    }
};

// =============================================================================
// AJAX REQUEST FUNCTIONS
// =============================================================================

const makeAjaxRequest = async (url) => {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.text();
};

const submitFormWithDelay = async (form) => {
    const formData = new FormData(form);
    const params = new URLSearchParams(formData);
    const url = `${form.action}?${params.toString()}`;
    
    // Save scroll position before AJAX request
    saveScrollPosition();
    
    // Start loading timer
    const loadingTimer = setTimeout(showLoading, LOADING_DELAY);
    
    try {
        const html = await makeAjaxRequest(url);
        
        // Clear loading timer if response came before delay
        clearTimeout(loadingTimer);
        
        // Update URL without page reload
        updateURL(params);
        
        // Update content
        updateContent(html);
        
        // Re-initialize advanced filters after content update
        initializeAdvancedFilters();
        
        // Restore scroll position after content update
        restoreScrollPosition();
        
    } catch (error) {
        console.error('Error:', error);
        clearTimeout(loadingTimer);
        // Fallback to normal form submission
        form.submit();
    }
};



// =============================================================================
// EVENT HANDLER FUNCTIONS
// =============================================================================

const handleFilterSubmit = (form) => async () => {
    await submitFormWithDelay(form);
};

// Usunięta funkcja handlePaginationClick - zastąpiona przez handlePaginationAction

// =============================================================================
// PAGINATION EVENT DELEGATION
// =============================================================================

/**
 * Handles pagination clicks using event delegation
 * This function is called by the universal event delegation system
 */
const handlePaginationAction = async (element, eventType, data) => {
    if (eventType !== 'click') return;
    
    const link = element.closest('a[data-page]');
    if (!link) return;
    
    const page = link.dataset.page;
    const url = link.href;
    
    try {
        // Save scroll position before navigation
        saveScrollPosition();
        
        // Show loading state
        showLoading();
        
        // Make AJAX request
        const html = await makeAjaxRequest(url);
        
        // Update content
        updateContent(html);
        
        // Update URL without page reload
        updateURL(url);
        
        // Re-initialize advanced filters after content update
        initializeAdvancedFilters();
        
        // Restore scroll position after content update
        restoreScrollPosition();
        
    } catch (error) {
        console.error('Error handling pagination:', error);
        // Fallback to normal navigation
        window.location.href = url;
    }
};

// =============================================================================
// LIMIT CHANGE HANDLER
// =============================================================================

/**
 * Handles limit selector changes
 * This function is called by the universal event delegation system
 */
const handleLimitChange = async (element, eventType, data) => {
    if (eventType !== 'change') return;
    
    const form = d.querySelector('form[method="GET"]');
    if (!form) return;
    
    // Update hidden limit field in form
    const limitHiddenField = d.querySelector('#limitHiddenField');
    if (limitHiddenField) {
        limitHiddenField.value = element.value;
    }
    
    // Reset page to 1 when limit changes
    const pageInput = form.querySelector('input[name="page"]');
    if (pageInput) {
        pageInput.value = '1';
    } else {
        // Create hidden page input if it doesn't exist
        const hiddenPageInput = d.createElement('input');
        hiddenPageInput.type = 'hidden';
        hiddenPageInput.name = 'page';
        hiddenPageInput.value = '1';
        form.appendChild(hiddenPageInput);
    }
    
    // Submit form immediately for limit changes (no debounce needed)
    await handleFilterSubmit(form)();
};

// =============================================================================
// EXPORTS FOR EVENT DELEGATION
// =============================================================================

export { handlePaginationAction, handleLimitChange, handleFilterSubmit };


const handleClearFilters = (form) => async () => {
    // Clear form inputs
    form.reset();
    
    // Clear advanced filters
    clearAdvancedFilters();
    
    // Set advanced filters to closed
    const hiddenField = d.querySelector('#advancedFiltersOpenField');
    if (hiddenField) hiddenField.value = 'false';
    
    // Use AJAX to submit cleared form
    await submitFormWithDelay(form);
};





// =============================================================================
// INITIALIZATION FUNCTION
// =============================================================================

const initializeFilterAjax = () => {
    const form = d.querySelector('form[method="GET"]');
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
    
    // Limit change is now handled by universal event delegation system
    
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
// INITIALIZATION
// =============================================================================

onReady(initializeFilterAjax); 