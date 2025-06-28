/**
 * SortModule - Handles sort functionality
 * Works with FilterManager to avoid code duplication
 */
class SortModule {
    constructor(manager) {
        this.manager = manager;
        this.config = manager.config.sortConfig;
    }
    
    performSort(sortValue, shouldUpdateURL = true) {
        if (!sortValue) {
            this.clear();
            return;
        }
        
        const [field, direction] = sortValue.split('|');
        
        // Get container class and item class from config
        const containerClass = this.manager.config.containerClass || 'tasks-container';
        const itemClass = this.manager.config.itemClass || 'col-md-6';
        
        const visibleItems = Array.from(document.querySelectorAll(`.${itemClass}:not([style*="display: none"])`));
        
        if (visibleItems.length === 0) return;
        
        // Get sort configuration from manager config
        const sortFields = this.manager.config.sortFields || {};
        const sortFieldConfig = sortFields[sortValue];
        
        if (!sortFieldConfig) {
            console.warn('No sort configuration found for:', sortValue);
            return;
        }
        
        // Sort visible items
        visibleItems.sort((a, b) => {
            let valueA, valueB;
            
            // Use data attributes if specified in config
            if (sortFieldConfig.field.startsWith('data-')) {
                const attributeName = sortFieldConfig.field.replace('data-', '');
                valueA = a.getAttribute(`data-${attributeName}`) || '';
                valueB = b.getAttribute(`data-${attributeName}`) || '';
                
                // Handle date values
                if (attributeName === 'created' || attributeName.includes('date')) {
                    valueA = valueA ? new Date(valueA) : new Date(0);
                    valueB = valueB ? new Date(valueB) : new Date(0);
                } else {
                    // Handle text values
                    valueA = valueA.toLowerCase();
                    valueB = valueB.toLowerCase();
                }
            } else {
                // Fallback to old task-specific logic for backwards compatibility
                switch (field) {
                    case 'taskName':
                        valueA = a.querySelector('.card-title')?.textContent.trim().toLowerCase() || '';
                        valueB = b.querySelector('.card-title')?.textContent.trim().toLowerCase() || '';
                        break;
                    case 'dateFrom':
                        const dateA = a.querySelector('.task-meta')?.textContent.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '';
                        const dateB = b.querySelector('.task-meta')?.textContent.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '';
                        valueA = dateA ? new Date(dateA) : new Date(0);
                        valueB = dateB ? new Date(dateB) : new Date(0);
                        break;
                    case 'isDone':
                        valueA = a.querySelector('input[type="checkbox"]')?.checked ? 1 : 0;
                        valueB = b.querySelector('input[type="checkbox"]')?.checked ? 1 : 0;
                        break;
                    default:
                        return 0;
                }
            }
            
            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        
        // Reorder using CSS order property - Bootstrap row is already flexbox
        if (visibleItems.length > 0) {
            // Reset all order values first
            const allItems = document.querySelectorAll(`.${itemClass}`);
            allItems.forEach(item => {
                item.style.order = '9999'; // Hidden items go to end
            });
            
            // Apply order to sorted visible items
            visibleItems.forEach((item, index) => {
                item.style.order = index.toString();
            });
        }
        
        if (shouldUpdateURL) {
            this.manager.updateURL();
        }
    }
    
    clear() {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.value = '';
        }
        
        // Reset CSS ordering - remove all order styles
        const itemClass = this.manager.config.itemClass || 'col-md-6';
        const allItems = document.querySelectorAll(`.${itemClass}`);
        allItems.forEach(item => {
            item.style.order = '';
        });
        
        // No need to reset container styles - using Bootstrap's built-in flexbox
    }
    
    getValue() {
        const sortSelect = document.getElementById('sortSelect');
        return sortSelect ? sortSelect.value : '';
    }
} 