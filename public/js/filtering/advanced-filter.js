// =============================================================================
// ADVANCED FILTERS MANAGEMENT
// =============================================================================

import { d } from '../utils/helpers.js';

// =============================================================================
// CONSTANTS
// =============================================================================

const CSS_CLASSES = {
    ADVANCED_FILTERS_HIDDEN: 'advanced-filters-hidden',
    FILTER_INPUT_HIDDEN: 'filter-input-hidden',
    BI_CHEVRON_UP: 'bi-chevron-up',
    BI_CHEVRON_DOWN: 'bi-chevron-down'
};

const SELECTORS = {
    DATE_INPUTS: 'input[type="date"]',
    DATE_CHECKBOXES: 'input[data-action="toggle-date-input"]',
    DATE_CONTAINERS: '[id^="input_"]'
};

// =============================================================================
// ADVANCED FILTERS TOGGLE
// =============================================================================

/**
 * Toggles advanced filters visibility
 */
const handleAdvancedFiltersToggle = () => {
    const advancedFilters = d.querySelector('#advancedFilters');
    const toggleIcon = d.querySelector('#filterToggleIcon');
    const hiddenField = d.querySelector('#advancedFiltersOpenField');
    
    if (advancedFilters && toggleIcon) {
        const isHidden = advancedFilters.classList.contains(CSS_CLASSES.ADVANCED_FILTERS_HIDDEN);
        
        if (isHidden) {
            advancedFilters.classList.remove(CSS_CLASSES.ADVANCED_FILTERS_HIDDEN);
            toggleIcon.classList.remove(CSS_CLASSES.BI_CHEVRON_DOWN);
            toggleIcon.classList.add(CSS_CLASSES.BI_CHEVRON_UP);
            if (hiddenField) hiddenField.value = 'true';
        } else {
            advancedFilters.classList.add(CSS_CLASSES.ADVANCED_FILTERS_HIDDEN);
            toggleIcon.classList.remove(CSS_CLASSES.BI_CHEVRON_UP);
            toggleIcon.classList.add(CSS_CLASSES.BI_CHEVRON_DOWN);
            if (hiddenField) hiddenField.value = 'false';
        }
    }
};

// =============================================================================
// DATE INPUT TOGGLE
// =============================================================================

/**
 * Toggles visibility of date input based on checkbox state
 * @param {string} filterId - ID of the filter (e.g., 'dateFrom', 'dateTo')
 */
const toggleDateInput = (filterId) => {
    const checkbox = d.querySelector(`#enable_${filterId}`);
    const inputContainer = d.querySelector(`#input_${filterId}`);
    
    if (!checkbox || !inputContainer) {
        console.warn(`Date input elements not found for filter: ${filterId}`);
        return;
    }
    
    if (checkbox.checked) {
        // Show date input
        inputContainer.classList.remove(CSS_CLASSES.FILTER_INPUT_HIDDEN);
    } else {
        // Hide date input and clear its value
        inputContainer.classList.add(CSS_CLASSES.FILTER_INPUT_HIDDEN);
        const dateInput = inputContainer.querySelector(SELECTORS.DATE_INPUTS);
        if (dateInput) {
            dateInput.value = '';
        }
    }
};

/**
 * Initializes date input states based on checkbox states
 */
const initializeDateInputs = () => {
    const dateCheckboxes = d.querySelectorAll(SELECTORS.DATE_CHECKBOXES);
    
    dateCheckboxes.forEach(checkbox => {
        const filterId = checkbox.dataset.filterId;
        if (filterId) {
            // Set initial state based on checkbox
            if (checkbox.checked) {
                toggleDateInput(filterId);
            }
        }
    });
};

// =============================================================================
// ADVANCED FILTERS STATE MANAGEMENT
// =============================================================================

/**
 * Clears all advanced filters
 */
const clearAdvancedFilters = () => {
    const advancedFilters = d.querySelector('#advancedFilters');
    if (advancedFilters) {
        // Uncheck all checkboxes
        const checkboxes = advancedFilters.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear date inputs
        const dateInputs = advancedFilters.querySelectorAll(SELECTORS.DATE_INPUTS);
        dateInputs.forEach(input => {
            input.value = '';
        });
        
        // Hide date input containers
        const dateContainers = advancedFilters.querySelectorAll(SELECTORS.DATE_CONTAINERS);
        dateContainers.forEach(container => {
            container.classList.add(CSS_CLASSES.FILTER_INPUT_HIDDEN);
        });
    }
};

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initializes advanced filters functionality
 */
const initializeAdvancedFilters = () => {
    // Initialize date inputs state
    initializeDateInputs();
    
    // Handle advanced filters toggle using ID
    const advancedFiltersToggle = d.querySelector('#advancedFiltersToggle');
    if (advancedFiltersToggle) {
        advancedFiltersToggle.addEventListener('click', handleAdvancedFiltersToggle);
    }
};

// =============================================================================
// EXPORTS
// =============================================================================

export { 
    handleAdvancedFiltersToggle,
    toggleDateInput,
    initializeDateInputs,
    clearAdvancedFilters,
    initializeAdvancedFilters
}; 