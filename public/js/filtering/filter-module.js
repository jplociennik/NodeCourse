import { d } from '../utils/helpers.js';
import DOMUtils from '../utils/dom-utils.js';
import { StatisticsUtils } from '../utils/statistics.js';

/**
 * FilterModule - Handles advanced filtering functionality
 */
let filterModuleManager = null;
let filterModuleConfig = null;

const initFilterModule = (manager) => {
    filterModuleManager = manager;
    filterModuleConfig = manager.config.filterConfig;
    restoreFiltersFromURL();
};

const restoreFiltersFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Restore status filters
    if (urlParams.get('done') === 'on') {
        const doneCheckbox = document.querySelector('#filter_done');
        if (doneCheckbox) doneCheckbox.checked = true;
    }
    if (urlParams.get('todo') === 'on') {
        const todoCheckbox = document.querySelector('#filter_todo');
        if (todoCheckbox) todoCheckbox.checked = true;
    }
    
    // Restore date filters
    const dateFrom = urlParams.get('dateFrom');
    if (dateFrom) {
        const dateFromCheckbox = document.querySelector('#enable_dateFrom');
        const dateFromInput = document.querySelector('#filter_dateFrom');
        if (dateFromCheckbox && dateFromInput) {
            dateFromCheckbox.checked = true;
            dateFromInput.value = dateFrom;
            document.querySelector('#input_dateFrom').style.display = 'block';
        }
    }
    
    const dateTo = urlParams.get('dateTo');
    if (dateTo) {
        const dateToCheckbox = document.querySelector('#enable_dateTo');
        const dateToInput = document.querySelector('#filter_dateTo');
        if (dateToCheckbox && dateToInput) {
            dateToCheckbox.checked = true;
            dateToInput.value = dateTo;
            document.querySelector('#input_dateTo').style.display = 'block';
        }
    }
    
    // Show advanced filters if any are active
    if (urlParams.get('done') || urlParams.get('todo') || dateFrom || dateTo) {
        const filtersContainer = document.querySelector('#advancedFilters');
        const toggleIcon = document.querySelector('#filterToggleIcon');
        if (filtersContainer && toggleIcon) {
            filtersContainer.style.display = 'block';
            toggleIcon.className = 'bi bi-chevron-up ms-1';
        }
    }
};

const applyAdvancedFilters = async (filters = {}) => {
    console.log('Applying filters - sending to server...');
    
    const filterParams = new URLSearchParams();
    
    // Keep existing search and sort parameters - fix references
    if (filterModuleManager && filterModuleManager.modules && filterModuleManager.modules.search && filterModuleManager.modules.search.getValue()) {
        filterParams.set('q', filterModuleManager.modules.search.getValue());
    }
    if (filterModuleManager && filterModuleManager.modules && filterModuleManager.modules.sort && filterModuleManager.modules.sort.getValue()) {
        filterParams.set('sort', filterModuleManager.modules.sort.getValue());
    }
    
    // Process checkbox filters (status)
    const statusCheckboxes = document.querySelectorAll('input[name="filter[status][]"]:checked');
    statusCheckboxes.forEach(checkbox => {
        filterParams.set(checkbox.value, 'on');
    });
    
    // Process date filters
    const dateFromCheckbox = document.querySelector('#enable_dateFrom');
    const dateFromInput = document.querySelector('#filter_dateFrom');
    if (dateFromCheckbox && dateFromCheckbox.checked && dateFromInput && dateFromInput.value) {
        filterParams.set('dateFrom', dateFromInput.value);
    }
    
    const dateToCheckbox = document.querySelector('#enable_dateTo');
    const dateToInput = document.querySelector('#filter_dateTo');
    if (dateToCheckbox && dateToCheckbox.checked && dateToInput && dateToInput.value) {
        filterParams.set('dateTo', dateToInput.value);
    }
    
    console.log('Sending filters to server:', filterParams.toString());
    
    try {
        // Send request to server using apiPost helper
        const response = await fetch(`${window.location.pathname}?${filterParams.toString()}`);
        const html = await response.text();
        
        // Parse response and extract tasks container
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newTasksContainer = doc.querySelector('.tasks-container');
        const newStatsElements = doc.querySelectorAll('.statistics-row .h5, .statistics-row small');
        
        if (newTasksContainer) {
            // Update tasks container
            const currentTasksContainer = d.querySelector('.tasks-container');
            if (currentTasksContainer) {
                currentTasksContainer.innerHTML = newTasksContainer.innerHTML;
            }
            
            // Update statistics using the statistics module
            StatisticsUtils.updateStatisticsFromResponse(doc);
            
            // Update URL without reload using DOMUtils
            const urlObject = {};
            filterParams.forEach((value, key) => {
                urlObject[key] = value;
            });
            DOMUtils.updateURL(urlObject);
            
            console.log('Filters applied successfully via server');
        }
    } catch (error) {
        console.error('Error applying filters:', error);
    }
};

const clearAdvancedFilters = () => {
    // Clear all filter inputs
    d.querySelectorAll('#advancedFilters input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    d.querySelectorAll('#advancedFilters input[type="date"]').forEach(dateInput => {
        dateInput.value = '';
    });
    
    // Hide date inputs
    d.querySelectorAll('[id^="input_"]').forEach(input => {
        input.style.display = 'none';
    });
    
    // Redirect without filters, keep only search and sort - fix references
    const filterParams = new URLSearchParams();
    if (filterModuleManager && filterModuleManager.modules && filterModuleManager.modules.search && filterModuleManager.modules.search.getValue()) {
        filterParams.set('q', filterModuleManager.modules.search.getValue());
    }
    if (filterModuleManager && filterModuleManager.modules && filterModuleManager.modules.sort && filterModuleManager.modules.sort.getValue()) {
        filterParams.set('sort', filterModuleManager.modules.sort.getValue());
    }
    
    window.location.search = filterParams.toString();
};

// Create FilterModule as an object with arrow functions
const FilterModule = function(manager) {
    initFilterModule(manager);
    
    return {
        restoreFiltersFromURL,
        applyFilters: applyAdvancedFilters,
        clear: clearAdvancedFilters
    };
};

// Export as default
export default FilterModule; 