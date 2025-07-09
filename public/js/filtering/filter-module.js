import { d } from '../utils/helpers.js';
import DOMUtils from '../utils/dom-utils.js';
import { StatisticsUtils } from '../utils/statistics.js';
import { FILTER_SELECTORS, FILTER_CLASSES } from './filter-constants.js';

/**
 * Builds filter parameters from form inputs
 */
const buildFilterParams = (manager) => {
    const filterParams = new URLSearchParams();
    
    // Keep existing search and sort parameters
    if (manager?.modules?.search?.getValue()) filterParams.set('q', manager.modules.search.getValue()); 
    if (manager?.modules?.sort?.getValue()) filterParams.set('sort', manager.modules.sort.getValue());
    
    // Add status filters
    const doneCheckbox = d.querySelector('#filter_done');
    const todoCheckbox = d.querySelector('#filter_todo');
    if (doneCheckbox?.checked) filterParams.set('done', 'on');
    if (todoCheckbox?.checked) filterParams.set('todo', 'on');
    
    // Add date filters if enabled and have values
    ['dateFrom', 'dateTo'].forEach(filterId => {
        const isEnabled = d.querySelector(`#enable_${filterId}`)?.checked;
        const value = d.querySelector(`#filter_${filterId}`)?.value;
        if (isEnabled && value) filterParams.set(filterId, value);
    });
    
    return filterParams;
};

/**
 * Updates page content with server response
 */
const updatePageContent = (doc) => {
    const newTasksContainer = doc.querySelector('.tasks-container');
    if (newTasksContainer) {
        d.querySelector('.tasks-container').innerHTML = newTasksContainer.innerHTML;
        StatisticsUtils.updateStatisticsFromResponse(doc);
    }
};

/**
 * Restores filters from URL parameters
 */
const restoreFiltersFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Restore status filters
    if (urlParams.get('done') === 'on') d.querySelector('#filter_done').checked = true;
    if (urlParams.get('todo') === 'on') d.querySelector('#filter_todo').checked = true;
    
    // Restore date filters
    ['dateFrom', 'dateTo'].forEach(filterId => {
        const value = urlParams.get(filterId);
        if (value) {
            d.querySelector(`#enable_${filterId}`).checked = true;
            d.querySelector(`#filter_${filterId}`).value = value;
            d.querySelector(`#input_${filterId}`).style.display = 'block';
        }
    });
    
    // Show advanced filters if any are active
    const hasActiveFilters = urlParams.get('done') || urlParams.get('todo') || 
                           urlParams.get('dateFrom') || urlParams.get('dateTo');
    
    if (hasActiveFilters) {
        const filtersContainer = d.querySelector('#advancedFilters');
        const toggleIcon = d.querySelector('#filterToggleIcon');
        if (filtersContainer && toggleIcon) {
            filtersContainer.style.display = 'block';
            toggleIcon.className = FILTER_CLASSES.CHEVRON_UP;
        }
    }
};

/**
 * Applies advanced filters by sending request to server
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
 * Clears all advanced filters and resets to default state
 */
const clearAdvancedFilters = async (manager) => {
    // Clear all inputs
    d.querySelectorAll(FILTER_SELECTORS.ADVANCED_CHECKBOXES).forEach(checkbox => checkbox.checked = false);
    d.querySelectorAll(FILTER_SELECTORS.ADVANCED_DATE_INPUTS).forEach(dateInput => dateInput.value = '');
    d.querySelectorAll(FILTER_SELECTORS.INPUT_CONTAINERS).forEach(container => container.style.display = 'none');
    
    // Reset sort and search
    DOMUtils.clearSortSelect();
    if (manager?.modules?.search?.clear) manager.modules.search.clear();
    
    // Force default sorting
    const filterParams = new URLSearchParams();
    filterParams.set('sort', '');
    
    try {
        const response = await fetch(`${window.location.pathname}?${filterParams.toString()}`);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        
        updatePageContent(doc);
        DOMUtils.updateURL(filterParams);
    } catch (error) {
        console.error('Error clearing filters:', error);
    }
};

/**
 * Sets up status checkbox mutual exclusion
 */
const setupStatusCheckboxes = () => {
    const doneCheckbox = d.querySelector('#filter_done');
    const todoCheckbox = d.querySelector('#filter_todo');
    
    if (doneCheckbox && todoCheckbox) {
        doneCheckbox.addEventListener('change', () => {
            if (doneCheckbox.checked) todoCheckbox.checked = false;
        });
        
        todoCheckbox.addEventListener('change', () => {
            if (todoCheckbox.checked) doneCheckbox.checked = false;
        });
    }
};

/**
 * Sets up advanced filter toggle behavior
 */
const setupFilterToggle = () => {
    const toggleButton = d.querySelector('[data-action="toggle-advanced-filters"]');
    const filtersContainer = d.querySelector('#advancedFilters');
    const toggleIcon = d.querySelector('#filterToggleIcon');
    
    if (toggleButton && filtersContainer && toggleIcon) {
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isVisible = filtersContainer.style.display === 'block';
            filtersContainer.style.display = isVisible ? 'none' : 'block';
            toggleIcon.className = isVisible ? FILTER_CLASSES.CHEVRON_DOWN : FILTER_CLASSES.CHEVRON_UP;
        });
    }
};

const FilterModule = (manager) => {
    restoreFiltersFromURL();
    setupStatusCheckboxes();
    setupFilterToggle();
    
    return {
        applyFilters: () => applyAdvancedFilters(manager),
        clear: () => clearAdvancedFilters(manager)
    };
};

export default FilterModule; 