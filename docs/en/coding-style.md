# Coding Style Guide

## General Principles

1. Use arrow functions instead of classes:
```javascript
// ❌ Don't use classes
class SearchModule {
    constructor(manager) {
        this.manager = manager;
    }
    
    search() {
        // ...
    }
}

// ✅ Use arrow functions and closures
const SearchModule = (manager) => {
    const search = () => {
        // ...
    };
    
    return { search };
};
```

2. Avoid excessive abstraction - helper functions only when actually used in multiple places:
```javascript
// ❌ Don't create helper functions for single use
const getFilterCheckboxState = (filterId) => {
    return document.querySelector(`#filter_${filterId}`).checked;
};

// ✅ Use DOM API directly for simple operations
const checkbox = document.querySelector('#filter_done');
if (checkbox?.checked) {
    // ...
}
```

3. Group related functions into modules, but don't create unnecessary abstraction layers:
```javascript
// ❌ Don't create unnecessary layers
const FilterUtils = {
    toggleContainer: (id, show) => {
        document.querySelector(id).style.display = show ? 'block' : 'none';
    }
};

// ✅ Use DOM API directly for simple operations
container.style.display = isVisible ? 'none' : 'block';
```

## Module Structure

1. Export only what is actually used in other modules:
```javascript
// ❌ Don't export everything
export { 
    initModule,  // used
    helperFunction,  // unused
    internalFunction  // unused
};

// ✅ Export only what is used
export { initModule };
```

2. Prefer default export for main module functionality:
```javascript
// ✅ Default export for main functionality
const FilterModule = (manager) => {
    // ...
};

export default FilterModule;
```

## DOM Handling

1. Use universal helper functions from `dom-utils.js` for frequently performed operations:
```javascript
// ❌ Don't duplicate code
items.forEach(item => {
    item.style.display = 'none';
});

// ✅ Use helper functions
DOMUtils.hideItems(items);
```

2. For simple, one-off operations use DOM API directly:
```javascript
// ❌ Don't create helper functions for simple operations
const setCheckboxState = (checkbox, state) => {
    checkbox.checked = state;
};

// ✅ Use DOM API directly
checkbox.checked = false;
```

## Comments and Documentation

1. Use JSDoc comments only for exported functions and complex operations:
```javascript
// ❌ Don't document everything
/**
 * Sets display to none
 * @param {HTMLElement} element - Element to hide
 */
const hideElement = (element) => {
    element.style.display = 'none';
};

// ✅ Document only complex functions
/**
 * Applies advanced filters and updates URL state
 * @param {FilterManager} manager - Filter manager instance
 * @returns {Promise<void>}
 */
const applyAdvancedFilters = async (manager) => {
    // ...
};
```

2. Use short, descriptive comments for code sections:
```javascript
// ❌ Don't use excessive separators
// =============================================================================
// FILTER INITIALIZATION
// =============================================================================

// ✅ Use simple, descriptive comments
// Filter initialization
```

## Error Handling

1. Use optional chaining operator for safe property access:
```javascript
// ❌ Don't use multiple checks
if (manager && manager.modules && manager.modules.search) {
    manager.modules.search.clear();
}

// ✅ Use optional chaining
if (manager?.modules?.search?.clear) {
    manager.modules.search.clear();
}
```

2. Always handle errors in asynchronous operations:
```javascript
// ❌ Don't leave unhandled Promises
fetch(url).then(response => {
    // ...
});

// ✅ Always handle errors
try {
    const response = await fetch(url);
    // ...
} catch (error) {
    console.error('Error:', error);
}
```

## Naming

1. Use descriptive variable and function names:
```javascript
// ❌ Don't use unclear names
const h = (e) => {
    // ...
};

// ✅ Use descriptive names
const handleFilterToggle = (event) => {
    // ...
};
```

2. Use consistent prefixes for related functions:
```javascript
// ❌ Inconsistent naming
const hideElement = () => {};
const showingItem = () => {};
const elementDisplay = () => {};

// ✅ Consistent naming
const showItem = () => {};
const hideItem = () => {};
const toggleItem = () => {};
``` 