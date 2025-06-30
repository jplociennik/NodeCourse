// =============================================================================
// TASK MANAGEMENT MODULE
// =============================================================================

// =============================================================================
// IMPORTS
// =============================================================================

import { d, setText, setClass, setHref, setStyle, apiPost } from './utils/helpers.js';
import { StatisticsUtils } from './utils/statistics.js';

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const TASK_API = {
    TOGGLE: (id) => `/zadania/admin/${id}/toggle`,
    DELETE: (id) => `/zadania/admin/${id}/usun`
};

const MESSAGES = {
    ERROR: 'Błąd podczas aktualizacji zadania',
    NETWORK_ERROR: 'Błąd połączenia z serwerem'
};

const CSS_CLASSES = {
    BADGE_SUCCESS: 'badge task-status bg-success',
    BADGE_WARNING: 'badge task-status bg-warning',
    ICON_SUCCESS: 'bi bi-check-circle text-success',
    ICON_MUTED: 'bi bi-check-circle text-muted'
};

const TASK_STATUS = {
    DONE: 'Wykonane',
    TODO: 'Do wykonania'
};

const SELECTORS = {
    TASK_CHECKBOXES: '[data-action="toggle-status"]',
    TASK_CHECKBOX_BY_ID: (taskId) => `[data-task-id="${taskId}"]`,
    TASK_ICON_BY_ID: (taskId) => `[data-task-icon="${taskId}"]`,
    INCOMPLETE_TASK_ICONS: '[data-task-icon]',
    FIRST_CHECKBOX: '[data-action="toggle-status"]'
};




// =============================================================================
// PRIVATE HELPER FUNCTIONS
// =============================================================================

/**
 * Gets all task checkboxes on the page
 * @returns {NodeList} All task checkboxes
 */
const getAllTaskCheckboxes = () => {
    return d.querySelectorAll(SELECTORS.TASK_CHECKBOXES);
};

/**
 * Gets a specific task checkbox by task ID
 * @param {string} taskId - The task ID
 * @returns {Element|null} The checkbox element or null
 */
const getTaskCheckbox = (taskId) => {
    return d.querySelector(SELECTORS.TASK_CHECKBOX_BY_ID(taskId));
};

/**
 * Gets task ID from a checkbox element
 * @param {Element} checkbox - The checkbox element
 * @returns {string|null} The task ID or null
 */
const getTaskIdFromCheckbox = (checkbox) => {
    return checkbox?.dataset?.taskId || null;
};

/**
 * Gets a task icon by task ID
 * @param {string} taskId - The task ID
 * @returns {Element|null} The icon element or null
 */
const getTaskIcon = (taskId) => {
    return d.querySelector(SELECTORS.TASK_ICON_BY_ID(taskId));
};

/**
 * Sets task title color for incomplete tasks
 * @param {Element} titleElement - The title element
 * @param {boolean} isIncomplete - Whether the task is incomplete
 */
const setTaskTitleColor = (titleElement, isIncomplete) => {
    if (!titleElement) return;
    
    if (isIncomplete) {
        // Set turkusowy color for incomplete tasks
        setStyle(titleElement, 'color', '#369992', 'important');
        titleElement.classList.add('task-incomplete');
    } else {
        // Remove custom color and class for completed tasks
        titleElement.style.removeProperty('color');
        titleElement.classList.remove('task-incomplete');
    }
};


/**
 * Shows an error message to the user using Bootstrap modal
 * @param {string} message - The error message to display
 * @param {string} title - Optional title for the error modal
 */
const showErrorMessage = (message, title = 'Błąd') => {
    const errorModal = d.querySelector('#errorModal');
    const errorTitle = d.querySelector('#errorModalTitle');
    const errorMessage = d.querySelector('#errorModalMessage');
    
    if (errorModal && setText(errorTitle, title) && setText(errorMessage, message)) {
        new bootstrap.Modal(errorModal).show();
    } else {
        console.error('Error modal elements not found, falling back to alert');
        alert(`${title}: ${message}`);
    }
};

/**
 * Sets initial colors for task titles based on their status
 */
const setInitialTaskColors = () => {
    const taskIcons = d.querySelectorAll(SELECTORS.INCOMPLETE_TASK_ICONS);
    
    taskIcons.forEach(icon => {
        if (icon.classList.contains('text-muted')) {
            const titleElement = icon.closest('.card-title');
            setTaskTitleColor(titleElement, true);
        }
    });
};

// =============================================================================
// PUBLIC API FUNCTIONS
// =============================================================================

/**
 * Sets up the delete confirmation modal with task information
 * @param {string} taskId - The ID of the task to delete
 * @param {string} taskName - The name of the task to display in modal
 */
const setDeleteTask = (taskId, taskName) => {
    const taskNameElement = d.querySelector('#taskToDelete');
    const confirmButton = d.querySelector('#confirmDeleteBtn');
    
    if (!setText(taskNameElement, taskName) || !setHref(confirmButton, TASK_API.DELETE(taskId))) {
        console.error('Delete modal elements not found');
    }
};

/**
 * Toggles task completion status via API call
 * @param {string} taskId - The ID of the task to toggle
 * @param {HTMLInputElement} checkbox - The checkbox element that triggered the change
 */
const toggleTaskStatus = async (taskId, checkbox) => {
    const originalState = checkbox.checked;
    
    try {
        const data = await apiPost(TASK_API.TOGGLE(taskId));
        
        if (data.success) {
            updateTaskUI(taskId, data.isDone);
        } else {
            throw new Error(data.error || MESSAGES.ERROR);
        }
        
    } catch (error) {
        console.error('Error toggling task status:', error);
        
        // Revert checkbox state
        checkbox.checked = !originalState;
        
        // Show user-friendly error message
        const errorMessage = error.message.includes('Failed to fetch') 
            ? MESSAGES.NETWORK_ERROR 
            : MESSAGES.ERROR;
            
        showErrorMessage(errorMessage);
    }
};

/**
 * Updates the UI elements to reflect the new task status
 * @param {string} taskId - The ID of the task
 * @param {boolean} isDone - Whether the task is completed
 */
const updateTaskUI = (taskId, isDone) => {
    // Update status badge
    const statusBadge = d.querySelector(`#status-${taskId}`);
    if (statusBadge) {
        setText(statusBadge, isDone ? TASK_STATUS.DONE : TASK_STATUS.TODO);
        setClass(statusBadge, isDone ? CSS_CLASSES.BADGE_SUCCESS : CSS_CLASSES.BADGE_WARNING);
    }
    
    // Update task icon
    const titleIcon = getTaskIcon(taskId);
    if (titleIcon) {
        setClass(titleIcon, isDone ? CSS_CLASSES.ICON_SUCCESS : CSS_CLASSES.ICON_MUTED);
        
        // Update title color based on task status
        const titleElement = titleIcon.closest('.card-title');
        setTaskTitleColor(titleElement, !isDone);
    }
    
    // Update statistics using the statistics module
    StatisticsUtils.updateStatistics();
};

// Statistics functionality moved to utils/statistics.js

// =============================================================================
// EVENT HANDLERS
// =============================================================================

/**
 * Handles keyboard shortcuts
 * @param {KeyboardEvent} e - The keyboard event
 */
const handleKeyboardShortcuts = (e) => {
    // Ctrl/Cmd + Enter to toggle first visible task
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const firstCheckbox = d.querySelector(SELECTORS.FIRST_CHECKBOX);
        if (firstCheckbox) {
            firstCheckbox.click();
            e.preventDefault();
        }
    }
};

/**
 * Handles initial page setup
 */
const handleDOMContentLoaded = () => {
    setInitialTaskColors();
    
    // You could add more initialization here:
    // - Global error handling
    // - Additional keyboard shortcuts
    // - Task drag & drop functionality
    // - Auto-save functionality
};

// Task action handlers moved to universal event delegation system (utils/event-handlers.js)

// =============================================================================
// EVENT LISTENERS SETUP
// =============================================================================

/**
 * Sets up all event listeners for the task management module
 */
const setupTaskEventListeners = () => {
    // Main DOM loaded event
    d.addEventListener('DOMContentLoaded', handleDOMContentLoaded);
    
    // Keyboard shortcuts
    d.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Task actions now handled by universal event delegation system
    // You could add more event listeners here:
    // - Window resize handling
    // - Visibility change handling
    // - Online/offline status
};

// =============================================================================
// MODULE EXPORTS
// =============================================================================

// Export functions for use by universal event delegation system
export { 
    setDeleteTask, 
    toggleTaskStatus, 
    updateTaskUI,
    getAllTaskCheckboxes,
    getTaskCheckbox,
    getTaskIdFromCheckbox,
    getTaskIcon,
    setTaskTitleColor
};

// =============================================================================
// MODULE INITIALIZATION
// =============================================================================

setupTaskEventListeners(); 