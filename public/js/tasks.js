// =============================================================================
// TASK MANAGEMENT MODULE
// =============================================================================

import { d, setText, setClass, setStyle, apiPost, onReady } from './utils/helpers.js';
import { showErrorModal } from './utils/alert-utils.js';

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const TASK_API = {
    TOGGLE: (id) => `/zadania/user/${id}/toggle`,
    DELETE: (id) => `/zadania/user/${id}/usun`
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

const SELECTORS = {
    TASK_ICON_BY_ID: (taskId) => `[data-task-icon="${taskId}"]`,
    INCOMPLETE_TASK_ICONS: '[data-task-icon]',
    FIRST_CHECKBOX: '[data-action="toggle-status"]'
};

// Export selectors for content updater
export const TASK_SELECTORS = {
    CONTAINER: '#tasksContainer',
    COUNT: '#taskCount'
};

// =============================================================================
// PRIVATE HELPER FUNCTIONS
// =============================================================================

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
    const deleteForm = d.querySelector('#deleteTaskForm');
    
    if (!setText(taskNameElement, taskName)) {
        console.error('Task name element not found'); return;
    }
    if (!deleteForm) {
        console.error('Delete form element not found'); return;
    }

    deleteForm.action = TASK_API.DELETE(taskId);
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
        } else throw new Error(data.error || MESSAGES.ERROR);
        
    } catch (error) {
        console.error('Error toggling task status:', error);
        
        checkbox.checked = !originalState;               
        showErrorModal(error.message.includes('Failed to fetch') ? MESSAGES.NETWORK_ERROR : MESSAGES.ERROR);
    }
};

/**
 * Updates the UI elements to reflect the new task status
 * @param {string} taskId - The ID of the task
 * @param {boolean} isDone - Whether the task is completed
 */
const updateTaskUI = async (taskId, isDone) => {
    const statusBadge = d.querySelector(`#status-${taskId}`);
    if (statusBadge) {
        setText(statusBadge, isDone ? 'Wykonane' : 'Do wykonania');
        setClass(statusBadge, isDone ? CSS_CLASSES.BADGE_SUCCESS : CSS_CLASSES.BADGE_WARNING);
    }
    
    const titleIcon = getTaskIcon(taskId);
    if (titleIcon) {
        setClass(titleIcon, isDone ? CSS_CLASSES.ICON_SUCCESS : CSS_CLASSES.ICON_MUTED);
        
        const titleElement = titleIcon.closest('.card-title');
        setTaskTitleColor(titleElement, !isDone);
    }
    
    // Update statistics from backend after task status change
    try {
        const form = d.querySelector('#filterForm');
        if (form) {
            const { submitFormWithDelay } = await import('./filtering/ajax-requests.js');
            await submitFormWithDelay(form, 'tasks');
        }
    } catch (error) {
        console.error('Error updating statistics after task status change:', error);
    }
};

// =============================================================================
// EVENT HANDLERS
// =============================================================================

/**
 * Handles keyboard shortcuts
 * @param {KeyboardEvent} e - The keyboard event
 */
const handleKeyboardShortcuts = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const firstCheckbox = d.querySelector(SELECTORS.FIRST_CHECKBOX);
        if (firstCheckbox) {
            firstCheckbox.click();
            e.preventDefault();
        }
    }
};

/**
 * Handles initial page setup and event listeners when DOM is ready
 */
const handleDOMContentLoaded = () => {
    setInitialTaskColors();
    d.addEventListener('keydown', handleKeyboardShortcuts);   
};

// =============================================================================
// MODULE INITIALIZATION
// =============================================================================

onReady(handleDOMContentLoaded); 

// =============================================================================
// MODULE EXPORTS
// =============================================================================

export { 
    setDeleteTask, 
    toggleTaskStatus
};