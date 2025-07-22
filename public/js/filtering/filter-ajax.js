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
    
    // Extract tasks container content or empty state
    const newTasksContainer = tempDiv.querySelector('.tasks-container');
    const newEmptyState = tempDiv.querySelector('.empty-state');
    const newTaskCount = tempDiv.querySelector('#taskCount');
    const newStatistics = tempDiv.querySelector('.statistics-row');
    const newPagination = tempDiv.querySelector('.pagination')?.closest('.row');
    
    // Update tasks container
    const tasksContainer = d.querySelector('.tasks-container');
    if (tasksContainer) {
        if (newTasksContainer) {
            tasksContainer.innerHTML = newTasksContainer.innerHTML;
        } else if (newEmptyState) {
            tasksContainer.innerHTML = newEmptyState.outerHTML;
        }
    }
    
    // Update task count - always update, even if newTaskCount is null (means 0 tasks)
    const taskCount = d.querySelector('#taskCount');
    if (taskCount) {
        if (newTaskCount) {
            taskCount.textContent = newTaskCount.textContent;
        } else {
            // If no task count found in response, it means 0 tasks
            taskCount.textContent = '0';
        }
    }
    
    // Update statistics - always update, even if newStatistics is null (means 0 tasks)
    const statisticsRow = d.querySelector('.statistics-row');
    if (statisticsRow) {
        if (newStatistics) {
            statisticsRow.innerHTML = newStatistics.innerHTML;
        } else {
            // If no statistics found in response, it means 0 tasks - hide statistics or show 0
            statisticsRow.innerHTML = '';
        }
    }
    
    // Update pagination
    const currentPagination = d.querySelector('.pagination')?.closest('.row');
    
    if (newPagination) {
        if (currentPagination) {
            // Update existing pagination
            currentPagination.innerHTML = newPagination.innerHTML;
        } else {
            // Insert new pagination after tasks container
            const tasksContainer = d.querySelector('.tasks-container');
            if (tasksContainer) {
                tasksContainer.parentNode.insertBefore(newPagination, tasksContainer.nextSibling);
            }
        }
    } else {
        // Remove current pagination if no pagination in response
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

const handlePaginationClick = async (event) => {
    event.preventDefault();
    
    const link = event.target.closest('a[data-page]');
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
    
    // Handle search button click (with debounce)
    const searchBtn = d.querySelector('#searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', debounce(handleFilterSubmit(form), 300));
    }
    
    // Handle apply filters button click (with debounce)
    const applyFiltersBtn = d.querySelector('#applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', debounce(handleFilterSubmit(form), 300));
    }
    
    // Handle clear filters button
    const clearFiltersBtn = d.querySelector('#clearFiltersBtn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', handleClearFilters(form));
    }
    
    // Handle pagination clicks using event delegation
    document.addEventListener('click', handlePaginationClick);
    
    // Handle limit change
    const limitSelect = d.querySelector('#limitSelect');
    if (limitSelect) {
        limitSelect.addEventListener('change', async (event) => {
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
            
            await handleFilterSubmit(form)();
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
// INITIALIZATION
// =============================================================================

onReady(initializeFilterAjax); 