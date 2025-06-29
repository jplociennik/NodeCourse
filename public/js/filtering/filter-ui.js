import { d, setClass } from '../utils/helpers.js';

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

const toggleAdvancedFilters = () => {
    const filtersContainer = d.querySelector('#advancedFilters');
    const toggleIcon = d.querySelector('#filterToggleIcon');
    
    if (filtersContainer.style.display === 'none') {
        // Show filters
        filtersContainer.style.display = 'block';
        setClass(toggleIcon, 'bi bi-chevron-up ms-1');
    } else {
        // Hide filters and clear all selected options
        filtersContainer.style.display = 'none';
        setClass(toggleIcon, 'bi bi-chevron-down ms-1');
        
        // Clear all filter checkboxes
        const checkboxes = filtersContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear all date inputs
        const dateInputs = filtersContainer.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.value = '';
        });
        
        // Hide all date input containers
        const dateContainers = filtersContainer.querySelectorAll('[id^="input_"]');
        dateContainers.forEach(container => {
            container.style.display = 'none';
        });
        
        // Apply filters to remove any active filtering
        // Use direct import instead of window reference
        import('../filtering/filters.js').then(({ applyFilters }) => {
            applyFilters();
        });
    }
};

// Export functions for module usage
export { toggleDateInput, toggleAdvancedFilters };

// Functions now handled by universal event delegation system 