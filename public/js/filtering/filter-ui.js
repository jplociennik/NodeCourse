import { d, setClass } from '../utils/helpers.js';
import { FILTER_SELECTORS, FILTER_CLASSES } from './filter-constants.js';

// Filter UI functionality
const toggleDateInput = (filterId) => {
    const checkbox = d.querySelector(`#enable_${filterId}`);
    const inputContainer = d.querySelector(`#input_${filterId}`);
    const dateInput = d.querySelector(`#filter_${filterId}`);
    
    if (checkbox.checked) {
        inputContainer.style.display = 'block';
    } else {
        inputContainer.style.display = 'none';
        dateInput.value = ''; // Clear value when hiding
    }
};

/**
 * Shows advanced filters panel
 * @param {HTMLElement} filtersContainer - Container element
 * @param {HTMLElement} toggleIcon - Icon element to update
 */
const showAdvancedFilters = (filtersContainer, toggleIcon) => {
    filtersContainer.style.display = 'block';
    setClass(toggleIcon, FILTER_CLASSES.CHEVRON_UP);
};

/**
 * Clears all filter checkboxes in container
 * @param {HTMLElement} c - Container to search for checkboxes
 */
const clearFilterCheckboxes = (c) => c.querySelectorAll(FILTER_SELECTORS.CHECKBOXES).forEach(checkbox => { checkbox.checked = false; });

/**
 * Clears all date inputs in container
 * @param {HTMLElement} c - Container to search for date inputs
 */
const clearDateInputs = (c) => c.querySelectorAll(FILTER_SELECTORS.DATE_INPUTS).forEach(input => { input.value = ''; });

/**
 * Hides all date input containers
 * @param {HTMLElement} c - Container to search for date containers
 */
const hideDateContainers = (c) => c.querySelectorAll(FILTER_SELECTORS.INPUT_CONTAINERS).forEach(c => { c.style.display = 'none'; });

/**
 * Reapplies filters to refresh the display
 */
const reapplyFilters = () => import('../filtering/filters.js').then(({ applyFilters }) => { applyFilters(); });

/**
 * Hides advanced filters and clears all selections
 * @param {HTMLElement} filtersContainer - Container element
 * @param {HTMLElement} toggleIcon - Icon element to update
 */
const hideAdvancedFilters = (filtersContainer, toggleIcon) => {
    filtersContainer.style.display = 'none';
    setClass(toggleIcon, FILTER_CLASSES.CHEVRON_DOWN);
    
    clearFilterCheckboxes(filtersContainer);
    clearDateInputs(filtersContainer);
    hideDateContainers(filtersContainer);
    reapplyFilters();
};

const toggleAdvancedFilters = () => {
    const filtersContainer = d.querySelector('#advancedFilters');
    const toggleIcon = d.querySelector('#filterToggleIcon');
    
    if (filtersContainer.style.display === 'none') {
        showAdvancedFilters(filtersContainer, toggleIcon);
    } else {
        hideAdvancedFilters(filtersContainer, toggleIcon);
    }
};

export { toggleDateInput, toggleAdvancedFilters };