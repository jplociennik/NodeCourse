// =============================================================================
// FILTER SYSTEM CONSTANTS
// Centralized selectors and classes used across filter modules
// =============================================================================

const FILTER_SELECTORS = {
    CHECKBOXES: 'input[type="checkbox"]',
    DATE_INPUTS: 'input[type="date"]',
    INPUT_CONTAINERS: '[id^="input_"]',   
    STATUS_CHECKBOXES: 'input[name="filter[status][]"]:checked',
    ADVANCED_CHECKBOXES: '#advancedFilters input[type="checkbox"]',
    ADVANCED_DATE_INPUTS: '#advancedFilters input[type="date"]'
};

const FILTER_CLASSES = {
    CHEVRON_UP: 'bi bi-chevron-up ms-1',
    CHEVRON_DOWN: 'bi bi-chevron-down ms-1'
};

export { 
    FILTER_SELECTORS,
    FILTER_CLASSES
}; 