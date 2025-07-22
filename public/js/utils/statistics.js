// =============================================================================
// STATISTICS UTILITY MODULE
// =============================================================================

import { d, setText, onReady } from './helpers.js';
import { CSS_CLASSES } from './helpers.js';

/**
 * Statistics module for managing and updating task counters
 * Used across filtering, task management, and other modules
 */

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const STATISTICS_CONFIG = {
    SELECTORS: {
        TODO_COUNT: '#todoCount',
        DONE_COUNT: '#doneCount',
        TASK_COUNT: '#taskCount',
        DONE_PERCENTAGE: '#donePercentage',
        DONE_PERCENTAGE_BAR: '#donePercentageBar',
        VISIBLE_CHECKBOXES: `.${CSS_CLASSES.TASK_ITEM}:not([style*="display: none"]) ${CSS_CLASSES.TASK_CHECKBOX}`,
        VISIBLE_CHECKED_CHECKBOXES: `.${CSS_CLASSES.TASK_ITEM}:not([style*="display: none"]) ${CSS_CLASSES.TASK_CHECKBOX}:checked`,
        VISIBLE_TASKS: `.${CSS_CLASSES.TASK_ITEM}:not([style*="display: none"])`,
        STATISTICS_ELEMENTS: '.statistics-row .h5, .statistics-row small'
    },
    
    TASK_ITEM_CLASS: CSS_CLASSES.TASK_ITEM
};

// =============================================================================
// PRIVATE HELPER FUNCTIONS
// =============================================================================

/**
 * Gets all visible task checkboxes
 * @returns {NodeList} List of visible checkboxes
 */
const getVisibleTaskCheckboxes = () => {
    return d.querySelectorAll(STATISTICS_CONFIG.SELECTORS.VISIBLE_CHECKBOXES);
};

/**
 * Counts tasks by their completion status
 * @returns {Object} Object with todoCount and doneCount
 */
const countTasksByStatus = () => {
    const visibleCheckboxes = getVisibleTaskCheckboxes();
    let todoCount = 0;
    let doneCount = 0;
    
    visibleCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            doneCount++;
        } else {
            todoCount++;
        }
    });
    
    return { todoCount, doneCount };
};

// =============================================================================
// PUBLIC API FUNCTIONS
// =============================================================================

/**
 * Updates the statistics counters in the sidebar
 * This is the main function called by other modules
 */
const updateStatistics = () => {
    const todoCountElement = d.querySelector(STATISTICS_CONFIG.SELECTORS.TODO_COUNT);
    const doneCountElement = d.querySelector(STATISTICS_CONFIG.SELECTORS.DONE_COUNT);
    
    if (todoCountElement && doneCountElement) {
        const { todoCount, doneCount } = countTasksByStatus();
        
        setText(todoCountElement, todoCount);
        setText(doneCountElement, doneCount);
        
        // Also update task count if element exists
        updateTaskCount();
    }
};

/**
 * Updates the general task count display
 * @returns {number} Total number of visible tasks
 */
const updateTaskCount = () => {
    const taskCountElement = d.querySelector(STATISTICS_CONFIG.SELECTORS.TASK_COUNT);
    
    if (taskCountElement) {
        const visibleTasks = d.querySelectorAll(STATISTICS_CONFIG.SELECTORS.VISIBLE_TASKS);
        const count = visibleTasks.length;
        setText(taskCountElement, count);
        return count;
    }   
    return 0;
};

/**
 * Gets current task counts without updating the UI
 * @returns {Object} Object with todoCount, doneCount, and totalCount
 */
const getTaskCounts = () => {
    const { todoCount, doneCount } = countTasksByStatus();
    const totalCount = todoCount + doneCount;
    
    return { todoCount, doneCount, totalCount };
};

/**
 * Updates statistics elements from server response (used in filtering)
 * @param {Document} doc - Document object containing updated statistics
 */
const updateStatisticsFromResponse = (doc) => {
    const newStatsElements = doc.querySelectorAll(STATISTICS_CONFIG.SELECTORS.STATISTICS_ELEMENTS);
    const currentStatsElements = d.querySelectorAll(STATISTICS_CONFIG.SELECTORS.STATISTICS_ELEMENTS);
    
    // Update each statistics element with new content
    newStatsElements.forEach((newElement, index) => {
        if (currentStatsElements[index]) {
            setText(currentStatsElements[index], newElement.textContent);
        }
    });
};

/**
 * Initializes statistics on page load
 */
const initializeStatistics = () => {
    // Initial statistics update
    updateStatistics();
};

// =============================================================================
// AUTO-INITIALIZATION
// =============================================================================

// Auto-initialize when DOM is ready
onReady(initializeStatistics);

// =============================================================================
// MODULE EXPORTS
// =============================================================================

// Export functions for use by other modules
const StatisticsUtils = {
    updateStatistics,
    updateTaskCount,
    getTaskCounts,
    updateStatisticsFromResponse,
    initializeStatistics
};

export { 
    StatisticsUtils,
    updateStatistics, 
    updateTaskCount, 
    getTaskCounts, 
    updateStatisticsFromResponse, 
    initializeStatistics 
}; 