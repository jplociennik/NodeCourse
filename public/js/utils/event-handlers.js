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
        // Call handler with element, event type, and data attributes object
        try { handler(target, e.type, target.dataset, e); } 
        catch (error) { console.error(`Error in action handler '${action}':`, error); }
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
    registerActionHandler('delete-task', async (_element, eventType, data) => {
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
    
    // Task export
    registerActionHandler('export-tasks', (_element, eventType) => {
        if (eventType !== 'click') return;
        exportTasks();
    });
    
    // Task export all
    registerActionHandler('export-all-tasks', (_element, eventType) => {
        if (eventType !== 'click') return;
        exportAllTasks();
    });
};

/**
 * Theme-related action handlers
 */
const setupThemeActions = () => {
    // Theme toggle
    registerActionHandler('toggle-theme', async (element, eventType) => {
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
    // Toggle advanced filters
    registerActionHandler('toggle-advanced-filters', async (_element, eventType) => {
        if (eventType !== 'click') return;
        
        // Dynamic import for code splitting - only load when needed
        const { handleAdvancedFiltersToggle } = await import('../filtering/advanced-filter.js');
        handleAdvancedFiltersToggle();
    });
    
    // Toggle date input
    registerActionHandler('toggle-date-input', async (_element, eventType, data) => {
        if (eventType !== 'change') return;
        
        const { filterId } = data;
        if (!filterId) return;
        
        // Dynamic import for code splitting - only load when needed
        const { toggleDateInput } = await import('../filtering/advanced-filter.js');
        toggleDateInput(filterId);
    });
    
    // Pagination handling
    registerActionHandler('pagination', async (element, eventType, pageName) => {
        if (eventType !== 'click') return;
        
        // Dynamic import for code splitting - only load when needed
        const { handlePaginationAction } = await import('../filtering/filter-ajax.js');
        handlePaginationAction(element, eventType, pageName);
    });
    
    // Limit selector handling
    registerActionHandler('limit-select', async (element, eventType, data) => {
        if (eventType !== 'change') return;
        
        // Dynamic import for code splitting - only load when needed
        const { handleLimitChange } = await import('../filtering/filter-ajax.js');
        handleLimitChange(element, eventType, data);
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