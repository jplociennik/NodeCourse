// =============================================================================
// FILTER CONFIG SERVICE
// =============================================================================

/**
 * Service for handling default filter configurations
 * Contains reusable configurations for filtering, sorting, and UI elements
 */

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const DEFAULT_SORT_FIELD_TYPES = {
    text: {
        selector: '.card-title',
        type: 'text',
        transform: (text) => text.toLowerCase()
    },
    date: {
        selector: '.task-meta',
        type: 'date',
        regex: /\d{4}-\d{2}-\d{2}/,
        transform: (match) => match?.[0] ? new Date(match[0]) : new Date(0)
    },
    checkbox: {
        selector: 'input[type="checkbox"]',
        type: 'checkbox',
        transform: (checked) => checked ? 1 : 0
    }
};

const DEFAULT_FILTER_CONFIG = {
    features: ['search', 'sort', 'advancedFilters', 'pagination'],
    title: 'Wyszukiwanie i sortowanie',
    icon: 'bi bi-funnel',
    showStatistics: true,
    containerClass: 'tasks-container',
    itemClass: 'col-md-6',
    searchFields: ['title'] // Search in .card-title content
};

// =============================================================================
// PUBLIC API FUNCTIONS
// =============================================================================

/**
 * Gets default sort field types configuration
 * @returns {Object} Default sort field types config
 */
const getDefaultSortFieldTypes = () => {
    return { ...DEFAULT_SORT_FIELD_TYPES };
};

/**
 * Gets default filter configuration
 * @returns {Object} Default filter config
 */
const getDefaultFilterConfig = () => {
    return { ...DEFAULT_FILTER_CONFIG };
};

/**
 * Creates sort fields config using default types
 * @param {Object} fieldMappings - Field name to type mappings
 * @returns {Object} Sort fields configuration
 */
const createSortFieldsConfig = (fieldMappings) => {
    const sortFields = {};
    const fieldTypes = getDefaultSortFieldTypes();
    
    Object.entries(fieldMappings).forEach(([fieldName, fieldType]) => {
        if (fieldTypes[fieldType]) {
            sortFields[fieldName] = { ...fieldTypes[fieldType] };
        }
    });
    
    return sortFields;
};

/**
 * Creates a complete filter configuration
 * @param {Object} options - Configuration options
 * @param {string} options.formAction - Form action URL
 * @param {Array} options.sortOptions - Sort options array
 * @param {Array} options.filterOptions - Filter options array
 * @param {Object} options.searchConfig - Search configuration
 * @param {Object} options.sortConfig - Sort configuration
 * @param {Object} options.filterConfig - Filter configuration
 * @returns {Object} Complete filter configuration
 */
const createFilterConfig = (options = {}) => {

    return {
        ...DEFAULT_FILTER_CONFIG,
        ...options
    };  
};

// =============================================================================
// MODULE EXPORTS
// =============================================================================

module.exports = {
    getDefaultSortFieldTypes,
    getDefaultFilterConfig,
    createSortFieldsConfig,
    createFilterConfig
}; 