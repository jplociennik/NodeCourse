// =============================================================================
// STATISTICS UTILITIES MODULE
// Centralized statistics management for all components
// =============================================================================

import { d } from './helpers.js';



// =============================================================================
// CORE STATISTICS FUNCTIONS
// =============================================================================

/**
 * Updates item statistics for any component
 * @param {string} itemClass - CSS class of items to count (e.g., 'profile-item', 'task-item')
 * @param {Object} options - Configuration options
 * @param {string} options.totalSelector - Selector for total count element
 * @param {string} options.visibleSelector - Selector for visible count element
 * @param {string} options.noResultsSelector - Selector for no results message
 * @returns {Object} Statistics object with counts
 */
const updateItemStatistics = (itemClass, options = {}) => {
    const {
        totalSelector = '#totalCount',
        visibleSelector = '#visibleCount',
        noResultsSelector = '#noResults'
    } = options;

    const totalItems = d.querySelectorAll(`.${itemClass}`).length;
    const visibleItems = d.querySelectorAll(`.${itemClass}:not([style*="display: none"])`).length;
    
    // Update total count
    const totalCountEl = d.querySelector(totalSelector);
    if (totalCountEl) totalCountEl.textContent = totalItems;
    
    // Update visible count
    const visibleCountEl = d.querySelector(visibleSelector);
    if (visibleCountEl) visibleCountEl.textContent = visibleItems;
    
    // Show/hide no results message
    const noResults = d.querySelector(noResultsSelector);
    if (noResults) {
        if (visibleItems === 0 && totalItems > 0) {
            noResults.classList.remove('d-none');
        } else {
            noResults.classList.add('d-none');
        }
    }
    
    return { totalItems, visibleItems };
};

/**
 * Updates task-specific statistics
 * @param {number} taskCount - Number of tasks
 */
const updateTaskCount = (taskCount) => {
    const taskCountElement = d.querySelector('#taskCount');
    if (taskCountElement) taskCountElement.textContent = taskCount;  
};

/**
 * Updates statistics row from HTML content
 * @param {string} html - HTML content containing statistics
 */
const updateStatisticsFromHTML = (html) => {
    const tempDiv = d.createElement('div');
    tempDiv.innerHTML = html;
    
    const newStatistics = tempDiv.querySelector('#statisticsRow');
    const currentStatisticsRow = d.querySelector('#statisticsRow');
    
    if (currentStatisticsRow && newStatistics) {
        currentStatisticsRow.innerHTML = newStatistics.innerHTML;
    } else if (currentStatisticsRow) {
        currentStatisticsRow.innerHTML = '';
    }
};

// =============================================================================
// EXPORTS
// =============================================================================

export {
    updateItemStatistics,
    updateTaskCount,
    updateStatisticsFromHTML
};
