// =============================================================================
// CONTENT UPDATE MANAGEMENT
// =============================================================================

import { d } from '../utils/helpers.js';
import { updateStatisticsFromHTML, updateTaskCount } from '../utils/statistics.js';
import { initializeAdvancedFilters } from './advanced-filter.js';

// =============================================================================
// CONTENT UPDATE FUNCTIONS
// =============================================================================

/**
 * Updates page content from HTML response
 * @param {string} html - HTML content from server
 * @param {string} pageName - Name of the current page (tasks or profile)
 */
const updateContent = async (html, pageName) => {
    const tempDiv = d.createElement('div');
    tempDiv.innerHTML = html;
    
    // Update statistics from backend using utility function
    updateStatisticsFromHTML(html);
    
    // Dynamically import selectors based on pageName
    let selectors;
    if (pageName === 'profile') {
        const { PROFILE_SELECTORS } = await import('../profile-list.js');
        selectors = PROFILE_SELECTORS;
    } else {
        const { TASK_SELECTORS } = await import('../tasks.js');
        selectors = TASK_SELECTORS;
    }
    
    // Extract container content or empty state
    const newContainer = tempDiv.querySelector(selectors.CONTAINER);
    const newEmptyState = tempDiv.querySelector('#emptyState');
    const newPagination = tempDiv.querySelector('#paginationContainer');
    
    if (selectors.COUNT) {
        const newCountElement = tempDiv.querySelector(selectors.COUNT);
        if (newCountElement) {
            updateTaskCount(newCountElement.textContent);
        }
    }
    
    // Update content container
    const contentContainer = d.querySelector(selectors.CONTAINER);
    if (contentContainer) {
        if (newContainer) {
            contentContainer.innerHTML = newContainer.innerHTML;
        } else if (newEmptyState) {
            contentContainer.innerHTML = newEmptyState.outerHTML;
        }
    }
    
    // Update pagination and results info
    const currentPagination = d.querySelector('#paginationContainer');   
    if (newPagination) {
        if (currentPagination) {
            currentPagination.innerHTML = newPagination.innerHTML;
        } else {
            const container = d.querySelector(selectors.CONTAINER);
            if (container) {
                container.parentNode.insertBefore(newPagination, container.nextSibling);
            }
        }
    } else if (currentPagination) {
        currentPagination.remove();
    }
    
    // Re-initialize advanced filters after content update
    initializeAdvancedFilters();
};

// =============================================================================
// EXPORTS
// =============================================================================

export { updateContent }; 