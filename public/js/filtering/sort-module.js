import DOMUtils from '../utils/dom-utils.js';
import { CSS_CLASSES } from '../utils/helpers.js';

/**
 * SortModule - Handles sort functionality
 * Works with FilterManager to avoid code duplication
 */
let sortModuleManager = null;
let sortModuleConfig = null;

const initSortModule = (manager) => {
    sortModuleManager = manager;
    sortModuleConfig = manager.config.sortConfig;
};

/**
 * Parses sort value into field and direction
 */
const parseSortValue = (sortValue) => {
    const [field, direction] = sortValue.split('|');
    return { field, direction };
};

/**
 * Gets sort value for a specific field from an item using field configuration
 */
const getSortValue = (item, field) => {
    // Get field configuration from manager
    const fieldConfig = sortModuleManager.config.sortFields?.[field];
    
    if (!fieldConfig) {
        console.warn('Unknown sort field:', field);
        return '';
    }
    
    const { selector, type, transform, regex, attribute } = fieldConfig;
    
    switch (type) {
        case 'text':
            let value;
            if (attribute) {
                // Get value from data attribute
                value = DOMUtils.getItemAttribute(item, selector, attribute) || '';
            } else {
                // Get value from element text content
                value = DOMUtils.getItemText(item, selector);
            }
            return transform ? transform(value) : value;
            
        case 'date':
            const meta = DOMUtils.getItemText(item, selector);
            const match = regex ? meta.match(regex) : [meta];
            return transform ? transform(match) : (match?.[0] ? new Date(match[0]) : new Date(0));
            
        case 'checkbox':
            const checked = DOMUtils.isItemChecked(item, selector);
            return transform ? transform(checked) : (checked ? 1 : 0);
            
        default:
            console.warn('Unknown field type:', type);
            return '';
    }
};

/**
 * Compares two sort values based on direction
 */
const compareSortValues = (valueA, valueB, direction) => {
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
};

/**
 * Sorts items based on field and direction
 */
const sortItems = (items, field, direction) => {
    return items.sort((a, b) => {
        const valueA = getSortValue(a, field);
        const valueB = getSortValue(b, field);
        return compareSortValues(valueA, valueB, direction);
    });
};

/**
 * Updates URL and counts if needed
 */
const updateSortState = (shouldUpdateURL) => {
    if (shouldUpdateURL && sortModuleManager.updateURL)
        sortModuleManager.updateURL();
    
    if (shouldUpdateURL && sortModuleManager.updateCounts)
        sortModuleManager.updateCounts();
};

const performSort = (sortValue, shouldUpdateURL = true) => {
    if (!sortValue) {
        clearSort();
        return;
    }
    
    const { field, direction } = parseSortValue(sortValue);
    const itemClass = sortModuleManager.config.itemClass || CSS_CLASSES.TASK_ITEM;
    const visibleItems = Array.from(DOMUtils.getVisibleItems(itemClass));
    
    if (visibleItems.length === 0) return;
    
    const sortedItems = sortItems(visibleItems, field, direction);
    DOMUtils.reorderItems(sortedItems);
    
    updateSortState(shouldUpdateURL);
};

const clearSort = () => {
    DOMUtils.clearSortSelect();
    
    const itemClass = sortModuleManager.config.itemClass || CSS_CLASSES.TASK_ITEM;
    DOMUtils.resetItemOrdering(itemClass);
};

const getSortModuleValue = () => {
    return DOMUtils.getSortSelectValue();
};

const SortModule = (manager) => {
    initSortModule(manager);
    
    return {
        performSort,
        clear: clearSort,
        getValue: getSortModuleValue
    };
};

export default SortModule; 