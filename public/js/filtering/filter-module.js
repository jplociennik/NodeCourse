import { d } from '../utils/helpers.js';
import DOMUtils from '../utils/dom-utils.js';
import { StatisticsUtils } from '../utils/statistics.js';
import { FILTER_SELECTORS, FILTER_CLASSES } from './filter-constants.js';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Restores single date filter from URL parameter
 * @param {string} filterId - Filter ID (dateFrom/dateTo)
 * @param {string} value - Date value from URL
 */
const restoreDateFilter = (filterId, value) => {
    if (!value) return;
    
    const checkbox = d.querySelector(`#enable_${filterId}`);
    const input = d.querySelector(`#filter_${filterId}`);
    
    if (checkbox && input) {
        checkbox.checked = true;
        input.value = value;
        d.querySelector(`#input_${filterId}`).style.display = 'block';
    }
};

/**
 * Adds date filter parameter if enabled and has value
 * @param {URLSearchParams} filterParams - Parameters object to add to
 * @param {string} filterId - Filter ID (dateFrom/dateTo)
 */
const addDateFilterParam = (filterParams, filterId) => {
    const checkbox = d.querySelector(`#enable_${filterId}`);
    const input = d.querySelector(`#filter_${filterId}`);
    
    if (checkbox && checkbox.checked && input && input.value) filterParams.set(filterId, input.value);
    
};

// =============================================================================
// BUSINESS LOGIC FUNCTIONS
// =============================================================================

/**
 * Restores status filter checkboxes from URL parameters
 * @param {URLSearchParams} urlParams - URL parameters object
 */
const restoreStatusFilters = (urlParams) => {
    const doneCheckbox = d.querySelector('#filter_done');
    const todoCheckbox = d.querySelector('#filter_todo');

    if (urlParams.get('done') === 'on') doneCheckbox.checked = true;
    if (urlParams.get('todo') === 'on') todoCheckbox.checked = true;
};

/**
 * Restores date filters from URL parameters
 * @param {URLSearchParams} urlParams - URL parameters object
 */
const restoreDateFilters = (urlParams) => {
    restoreDateFilter('dateFrom', urlParams.get('dateFrom'));
    restoreDateFilter('dateTo', urlParams.get('dateTo'));
};

/**
 * Shows advanced filters container if any filters are active
 * @param {URLSearchParams} urlParams - URL parameters object
 */
const showAdvancedFiltersIfActive = (urlParams) => {
    const hasActiveFilters = urlParams.get('done') || urlParams.get('todo') ||  urlParams.get('dateFrom') || urlParams.get('dateTo');
    
    if (hasActiveFilters) {
        d.querySelector('#advancedFilters').style.display = 'block';
        d.querySelector('#filterToggleIcon').className = FILTER_CLASSES.CHEVRON_UP;
    }
};

/**
 * Builds filter parameters from form inputs
 * @param {Object} manager - Filter manager instance
 * @returns {URLSearchParams} Filter parameters
 */
const buildFilterParams = (manager) => {
    const filterParams = new URLSearchParams();
    
    // Keep existing search and sort parameters
    if (manager?.modules?.search?.getValue()) filterParams.set('q', manager.modules.search.getValue()); 
    if (manager?.modules?.sort?.getValue()) filterParams.set('sort', manager.modules.sort.getValue());
    
    // Add status filters
    d.querySelectorAll(FILTER_SELECTORS.STATUS_CHECKBOXES).forEach(checkbox => {
        filterParams.set(checkbox.value, 'on');
    });
    
    // Add date filters
    addDateFilterParam(filterParams, 'dateFrom');
    addDateFilterParam(filterParams, 'dateTo');
    
    return filterParams;
};

/**
 * Updates page content with server response
 * @param {Document} doc - Parsed HTML document from server
 */
const updatePageContent = (doc) => {
    const newTasksContainer = doc.querySelector('.tasks-container');
    if (newTasksContainer) {
        d.querySelector('.tasks-container').innerHTML = newTasksContainer.innerHTML;
        StatisticsUtils.updateStatisticsFromResponse(doc);
    }
};

/**
 * Clears all advanced filter inputs
 */
const clearFilterInputs = () => {
    d.querySelectorAll(FILTER_SELECTORS.ADVANCED_CHECKBOXES).forEach(checkbox => checkbox.checked = false);
    d.querySelectorAll(FILTER_SELECTORS.ADVANCED_DATE_INPUTS).forEach(dateInput => dateInput.value = '');
    d.querySelectorAll(FILTER_SELECTORS.INPUT_CONTAINERS).forEach(input => input.style.display = 'none');
};

// =============================================================================
// MAIN API FUNCTIONS
// =============================================================================

/**
 * Restores all filters from URL parameters
 */
const restoreFiltersFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    restoreStatusFilters(urlParams);
    restoreDateFilters(urlParams);
    showAdvancedFiltersIfActive(urlParams);
};

/**
 * Applies advanced filters by sending request to server
 * @param {Object} manager - Filter manager instance
 */
const applyAdvancedFilters = async (manager) => {
    const filterParams = buildFilterParams(manager);
    
    try {
        const response = await fetch(`${window.location.pathname}?${filterParams.toString()}`);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        
        updatePageContent(doc); 
        DOMUtils.updateURL(filterParams);
        
    } catch (error) {
        console.error('Error applying filters:', error);
    }
};

/**
 * Clears all advanced filters and redirects
 * @param {Object} manager - Filter manager instance
 */
const clearAdvancedFilters = (manager) => {
    clearFilterInputs();
    
    const filterParams = new URLSearchParams();
    if (manager?.modules?.search?.getValue()) filterParams.set('q', manager.modules.search.getValue());
    if (manager?.modules?.sort?.getValue()) filterParams.set('sort', manager.modules.sort.getValue());
    
    window.location.search = filterParams.toString();
};

// =============================================================================
// MODULE FACTORY
// =============================================================================

const FilterModule = function(manager) {
    restoreFiltersFromURL();
    
    return {
        restoreFiltersFromURL,
        applyFilters: () => applyAdvancedFilters(manager),
        clear: () => clearAdvancedFilters(manager)
    };
};

export default FilterModule; 