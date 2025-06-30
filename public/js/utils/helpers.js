// Simple helpers for DOM and API operations

// =============================================================================
// CONSTANTS
// =============================================================================

const d = document;

// =============================================================================
// DOM HELPER FUNCTIONS
// =============================================================================

const setText = (element, text) => element && (element.textContent = text);
const setClass = (element, className) => element && (element.className = className);
const setHref = (element, href) => element && (element.href = href);
const setStyle = (element, property, value, priority = '') => element && element.style.setProperty(property, value, priority);

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

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

// =============================================================================
// EXPORTS
// =============================================================================

export { d, setText, setClass, setHref, setStyle, onReady, apiPost }; 