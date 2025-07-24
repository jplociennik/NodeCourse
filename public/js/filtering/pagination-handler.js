// =============================================================================
// PAGINATION HANDLER
// =============================================================================

import { updateURL } from '../utils/dom-utils.js';
import { saveScrollPosition, restoreScrollPosition } from '../utils/scroll-manager.js';
import { showLoading } from './loading-state.js';
import { updateContent } from './content-updater.js';
import { makeAjaxRequest } from './ajax-requests.js';

// =============================================================================
// PAGINATION ACTION HANDLER
// =============================================================================

/**
 * Handles pagination clicks using event delegation
 * This function is called by the universal event delegation system
 */
const handlePaginationAction = async (element, eventType, _data) => {
    if (eventType !== 'click') return;
    const pageName = window.location.pathname.substring(1);
    const link = element.closest('a[data-page]');
    if (!link) return;
    
    const page = link.dataset.page;
    const url = link.href;
    
    try {
        // Save scroll position before navigation
        saveScrollPosition();
        
        // Show loading state
        showLoading(pageName);
        
        // Make AJAX request
        const html = await makeAjaxRequest(url);
        
        // Update content
        await updateContent(html, pageName);
        
        // Update URL without page reload
        updateURL(url);
        
        // Restore scroll position after content update
        restoreScrollPosition();
        
    } catch (error) {
        console.error('Error handling pagination:', error);
        // Fallback to normal navigation
        window.location.href = url;
    }
};

// =============================================================================
// EXPORTS
// =============================================================================

export { handlePaginationAction }; 