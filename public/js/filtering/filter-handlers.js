// =============================================================================
// FILTER HANDLERS
// =============================================================================

import { d } from '../utils/helpers.js';
import { clearAdvancedFilters } from './advanced-filter.js';
import { submitFormWithDelay } from './ajax-requests.js';

// =============================================================================
// FILTER EVENT HANDLERS
// =============================================================================

/**
 * Handles filter form submission
 * @param {HTMLFormElement} form - Form to submit
 */
const handleFilterSubmit = (form, pageName) => async () => {
    await submitFormWithDelay(form, pageName);
};

/**
 * Handles clearing all filters
 * @param {HTMLFormElement} form - Form to clear
 */
const handleClearFilters = (form, pageName) => async () => {
    // Clear form inputs
    form.reset();
    
    // Clear advanced filters
    clearAdvancedFilters();
    
    // Set advanced filters to closed
    const hiddenField = d.querySelector('#advancedFiltersOpenField');
    if (hiddenField) hiddenField.value = 'false';
    
    // Use AJAX to submit cleared form
    await submitFormWithDelay(form, pageName);
};

// =============================================================================
// EXPORTS
// =============================================================================

export { handleFilterSubmit, handleClearFilters }; 