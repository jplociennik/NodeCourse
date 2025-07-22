// Simple helpers for DOM and API operations

// =============================================================================
// CONSTANTS
// =============================================================================

const d = document;

// CSS Classes
const CSS_CLASSES = {
    TASK_ITEM: 'col-md-6',
    TASK_CHECKBOX: 'input[type="checkbox"][id^="task-"]',
    CARD_TITLE: '.card-title',
    TASK_META: '.task-meta'
};

// =============================================================================
// DOM HELPER FUNCTIONS
// =============================================================================

const setText = (element, text) => element && (element.textContent = text);
const setClass = (element, className) => element && (element.className = className);
const setHref = (element, href) => element && (element.href = href);
const setStyle = (element, property, value, priority = '') => element && element.style.setProperty(property, value, priority);
const removeStyle = (element, property) => element && element.style.removeProperty(property);

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Executes handler when DOM is ready or immediately if DOM is already loaded
 * @param {Function} handler - Function to execute when DOM is ready
 */
const onReady = (handler) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handler);
    } else {
        handler();
    }
};

const apiPost = async (url, data = null) => {
    const options = { method: 'POST', headers: { 'Content-Type': 'application/json' } };

    if (data) options.body = JSON.stringify(data);
    const response = await fetch(url, options);
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};

const debounce = (fn, delay = 300) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
};

// =============================================================================
// EXPORTS
// =============================================================================

export { d, setText, setClass, setHref, setStyle, removeStyle, onReady, apiPost, debounce, CSS_CLASSES }; 