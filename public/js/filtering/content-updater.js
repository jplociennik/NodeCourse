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
 */
const updateContent = (html) => {
    const tempDiv = d.createElement('div');
    tempDiv.innerHTML = html;
    
    // Update statistics from backend using utility function
    updateStatisticsFromHTML(html);
    
    // Extract tasks container content or empty state
    const newTasksContainer = tempDiv.querySelector('#tasksContainer');
    const newEmptyState = tempDiv.querySelector('#emptyState');
    const newPagination = tempDiv.querySelector('#paginationContainer');
    
    // Update task count badge using utility function
    const newTaskCountElement = tempDiv.querySelector('#taskCount');
    if (newTaskCountElement) {
        updateTaskCount(newTaskCountElement.textContent);
    }
    
    // Update tasks container
    const tasksContainer = d.querySelector('#tasksContainer');
    if (tasksContainer) {
        if (newTasksContainer) {
            tasksContainer.innerHTML = newTasksContainer.innerHTML;
        } else if (newEmptyState) {
            tasksContainer.innerHTML = newEmptyState.outerHTML;
        }
    }
    
    // Update pagination and results info (now combined in one element)
    const currentPagination = d.querySelector('#paginationContainer');
    
    if (newPagination) {
        if (currentPagination) {
            // Update existing pagination (which now includes results info)
            currentPagination.innerHTML = newPagination.innerHTML;
        } else {
            // Insert new pagination after tasks container
            const tasksContainer = d.querySelector('#tasksContainer');
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
    
    // Re-initialize advanced filters after content update
    initializeAdvancedFilters();
};

// =============================================================================
// EXPORTS
// =============================================================================

export { updateContent }; 