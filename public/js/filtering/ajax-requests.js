// =============================================================================
// AJAX REQUEST MANAGEMENT
// =============================================================================

import { updateURL } from '../utils/dom-utils.js';
import { saveScrollPosition, restoreScrollPosition } from '../utils/scroll-manager.js';
import { showLoading, LOADING_DELAY } from './loading-state.js';
import { updateContent } from './content-updater.js';

// =============================================================================
// AJAX REQUEST FUNCTIONS
// =============================================================================

/**
 * Makes AJAX request to given URL
 * @param {string} url - URL to request
 * @returns {Promise<string>} HTML response
 */
const makeAjaxRequest = async (url) => {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.text();
};

/**
 * Submits form with delay and loading state
 * @param {HTMLFormElement} form - Form to submit
 */
const submitFormWithDelay = async (form, pageName) => {
    const formData = new FormData(form);
    const params = new URLSearchParams(formData);
    const url = `${form.action}?${params.toString()}`;
    
    // Save scroll position before AJAX request
    saveScrollPosition();
    
    // Start loading timer
    const loadingTimer = setTimeout(() => showLoading(pageName), LOADING_DELAY);
    
    try {
        const html = await makeAjaxRequest(url);
        
        // Clear loading timer if response came before delay
        clearTimeout(loadingTimer);
        
        // Update URL without page reload
        updateURL(params);
        
        // Update content
        await updateContent(html, pageName);
        
        // Restore scroll position after content update
        restoreScrollPosition();
        
    } catch (error) {
        console.error('Error:', error);
        clearTimeout(loadingTimer);
        // Fallback to normal form submission
        form.submit();
    }
};

// =============================================================================
// EXPORTS
// =============================================================================

export { makeAjaxRequest, submitFormWithDelay }; 