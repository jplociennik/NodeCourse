// =============================================================================
// LIMIT CHANGE HANDLER
// =============================================================================

import { d } from '../utils/helpers.js';
import { submitFormWithDelay } from './ajax-requests.js';

// =============================================================================
// LIMIT CHANGE HANDLERS
// =============================================================================

/**
 * Handles limit selector changes
 * This function is called by the universal event delegation system
 */
const handleLimitChange = async (element, eventType, data) => {
    if (eventType !== 'change') return;
    
    const form = d.querySelector('#filterForm');
    if (!form) return;
    
    // Update hidden limit field in form
    const limitHiddenField = d.querySelector('#limitHiddenField');
    if (limitHiddenField) {
        limitHiddenField.value = element.value;
    }
    
    // Reset page to 1 when limit changes
    const pageInput = form.querySelector('input[name="page"]');
    if (pageInput) {
        pageInput.value = '1';
    } else {
        // Create hidden page input if it doesn't exist
        const hiddenPageInput = d.createElement('input');
        hiddenPageInput.type = 'hidden';
        hiddenPageInput.name = 'page';
        hiddenPageInput.value = '1';
        form.appendChild(hiddenPageInput);
    }
    
    // Submit form immediately for limit changes (no debounce needed)
    await submitFormWithDelay(form);
};

// =============================================================================
// EXPORTS
// =============================================================================

export { handleLimitChange }; 