// =============================================================================
// UNIVERSAL EVENT DELEGATION SYSTEM
// Handles all data-action events across the application
// =============================================================================

import { d, onReady } from './helpers.js';

// =============================================================================
// ACTION HANDLERS REGISTRY
// =============================================================================

const actionHandlers = new Map();

/**
 * Register an action handler
 * @param {string} actionName - The action name (from data-action)
 * @param {Function} handler - Handler function (element, eventType, data)
 */
const registerActionHandler = (actionName, handler) => actionHandlers.set(actionName, handler);

/**
 * Unregister an action handler
 * @param {string} actionName - The action name to remove
 */
const unregisterActionHandler = (actionName) => actionHandlers.delete(actionName);

// =============================================================================
// MAIN EVENT DELEGATION HANDLER
// =============================================================================

/**
 * Universal event delegation handler
 * @param {Event} e - The event object
 */
const handleUniversalActions = (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    const handler = actionHandlers.get(action);
    
    if (handler) {
        // Call handler with element, event type, and all data attributes
        const data = { ...target.dataset };
        try {
            handler(target, e.type, data, e);
        } catch (error) {
            console.error(`Error in action handler '${action}':`, error);
        }
    } else {
        console.warn(`No handler registered for action: ${action}`);
    }
};

// =============================================================================
// BUILT-IN ACTION HANDLERS
// =============================================================================

/**
 * Task-related action handlers
 */
const setupTaskActions = () => {
    // Task toggle status
    registerActionHandler('toggle-status', async (element, eventType, data) => {
        if (eventType !== 'change') return;
        
        const { taskId } = data;
        if (!taskId) {
            console.warn('No task ID found for toggle-status action');
            return;
        }
        
        // Dynamic import for code splitting and performance optimization
        const { toggleTaskStatus } = await import('../tasks.js');
        toggleTaskStatus(taskId, element);
    });
    
    // Task delete setup
    registerActionHandler('delete-task', async (element, eventType, data) => {
        if (eventType !== 'click') return;
        
        const { taskId, taskName } = data;
        if (!taskId || !taskName) {
            console.warn('Missing task ID or name for delete-task action', data);
            return;
        }
        
        // Dynamic import for code splitting and performance optimization
        const { setDeleteTask } = await import('../tasks.js');
        setDeleteTask(taskId, taskName);
    });
};

/**
 * Theme-related action handlers
 */
const setupThemeActions = () => {
    // Theme toggle
    registerActionHandler('toggle-theme', async (element, eventType, data) => {
        if (eventType !== 'click') return;
        
        // Find theme icon within the button
        const themeIcon = element.querySelector('#themeIcon');
        if (!themeIcon) {
            console.warn('Theme icon not found in toggle button');
            return;
        }
        
        // Dynamic import for code splitting and performance optimization
        const { handleThemeToggle } = await import('../theme.js');
        handleThemeToggle(themeIcon);
    });
};

/**
 * Filter-related action handlers
 */
const setupFilterActions = () => {
    // Apply filters
    registerActionHandler('apply-filters', async (element, eventType, data) => {
        if (eventType !== 'click') return;
        
        // Dynamic import for code splitting - only load when needed
        const { applyFilters } = await import('../filtering/filters.js');
        applyFilters();
    });
    
    // Clear filters
    registerActionHandler('clear-filters', async (element, eventType, data) => {
        if (eventType !== 'click') return;
        
        // Dynamic import for code splitting - only load when needed
        const { clearFilters } = await import('../filtering/filters.js');
        clearFilters();
    });
    
    // Toggle advanced filters
    registerActionHandler('toggle-advanced-filters', async (element, eventType, data) => {
        if (eventType !== 'click') return;
        
        // Dynamic import for code splitting - only load when needed
        const { toggleAdvancedFilters } = await import('../filtering/filter-ui.js');
        toggleAdvancedFilters();
    });
    
    // Toggle date input
    registerActionHandler('toggle-date-input', async (element, eventType, data) => {
        if (eventType !== 'change') return;
        
        const { filterId } = data;
        if (!filterId) return;
        
        // Dynamic import for code splitting - only load when needed
        const { toggleDateInput } = await import('../filtering/filter-ui.js');
        toggleDateInput(filterId);
    });
};

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize the universal event delegation system
 */
const initializeEventDelegation = () => {
    setupTaskActions();
    setupThemeActions();
    setupFilterActions();
    
    d.addEventListener('click', handleUniversalActions);
    d.addEventListener('change', handleUniversalActions);
    d.addEventListener('input', handleUniversalActions);
    
    console.log('Universal event delegation system initialized');
};

// =============================================================================
// AUTO-INITIALIZATION
// =============================================================================

onReady(initializeEventDelegation);