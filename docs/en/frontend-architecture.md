# Frontend JavaScript Architecture

Technical documentation of the JavaScript system in the NodeCourse project.

## Table of Contents

1. [System Overview](#system-overview)
2. [Modular Architecture](#modular-architecture)
3. [Directory Structure](#directory-structure)
4. [Core Components](#core-components)
5. [Filtering System](#filtering-system)
6. [Event Management](#event-management)
7. [Adding Functionality](#adding-functionality)
8. [Coding Conventions](#coding-conventions)
9. [Troubleshooting](#troubleshooting)
10. [System Development](#system-development)

---

## System Overview

The NodeCourse application's frontend JavaScript system implements a modular architecture based on ES6 modules with the following characteristics:

### Technical Characteristics:
- **ES6 Modules** - All scripts use native import/export syntax
- **Event Delegation** - Centralized event management system
- **Filtering System** - Configurable search and sort module
- **Theme Management** - Light/dark theme switching system
- **Performance Optimizations** - Debouncing, lazy loading, caching

### Functionalities:
- Text search in tasks
- Sorting by various criteria
- Advanced filtering
- Theme switching
- Task management (CRUD)
- Statistics and counters

---

## Modular Architecture

### Module Division
The system consists of specialized modules:

```javascript
// Import functional modules
import { search } from './search-module.js';
import { sort } from './sort-module.js';
import { changeTheme } from './theme.js';
```

### Event Delegation System
Central point for handling all events:

```html
<!-- Element with data-action attribute -->
<button data-action="toggle-theme">
    Change theme
</button>
```

```javascript
// Central event listener
document.addEventListener('click', (event) => {
    if (event.target.dataset.action === 'toggle-theme') {
        changeTheme();
    }
});
```

### Configuration Architecture
Field configuration instead of hard-coding:

```javascript
// Sort field configuration
const config = {
    taskName: {
        selector: '.card-title',
        type: 'text',
        transform: text => text.toLowerCase()
    },
    taskDate: {
        selector: '.task-date',
        type: 'date',
        transform: text => new Date(text)
    }
};
```

---

## Directory Structure

```
public/js/
├── theme.js                  # Theme management
├── tasks.js                  # Task operations
├── theme-prevention.js       # Theme flicker prevention
├── filtering/               # Filtering system
│   ├── filter-manager.js    # Filter coordinator
│   ├── search-module.js     # Search module
│   ├── sort-module.js       # Sort module
│   ├── filter-module.js     # Advanced filters
│   ├── filter-constants.js  # Filter constants
│   └── filter-ui.js         # User interface
└── utils/                   # Helper utilities
    ├── helpers.js           # Basic functions
    ├── dom-utils.js         # DOM manipulation
    ├── event-handlers.js    # Event handling
    └── statistics.js        # Statistics
```

---

## Core Components

### theme.js - Theme Management

**Functionalities:**
- System preference detection
- User choice storage in localStorage
- Theme synchronization across tabs
- Flicker prevention on load

**Implementation:**
```javascript
function changeTheme() {
    const currentTheme = localStorage.getItem('theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
}
```

### tasks.js - Task Management

**Functionalities:**
- Marking tasks as done/undone
- Task deletion
- Counter updates
- Operation status notifications

**Implementation:**
```javascript
function markTaskAsDone(taskId, checkbox) {
    const isDone = checkbox.checked;
    
    fetch(`/tasks/${taskId}/status`, {
        method: 'POST',
        body: JSON.stringify({ done: isDone })
    });
    
    const task = checkbox.closest('.task-item');
    task.classList.toggle('completed', isDone);
}
```

### Utils System

#### helpers.js - Basic Functions
```javascript
// Shortcuts for frequently used functions
const d = document;
const $ = selector => d.querySelector(selector);

// Safe text setting
function setText(element, text) {
    if (element) {
        element.textContent = text;
    }
}

// Centralized CSS classes
const CSS_CLASSES = {
    TASK_ITEM: 'col-md-6',
    TASK_CHECKBOX: 'form-check-input',
    CARD_TITLE: 'card-title'
};
```

#### dom-utils.js - DOM Manipulation
```javascript
// Finding elements
function findAllTasks() {
    return document.querySelectorAll('.task-item');
}

// Showing/hiding elements
function showElement(element) {
    element.style.display = 'block';
}

function hideElement(element) {
    element.style.display = 'none';
}
```

---

## Filtering System

### Filter Manager - Main Coordinator

**Responsibilities:**
- Coordination of search, sort, and filter modules
- Dynamic module loading
- URL management with filter parameters

**Configuration:**
```javascript
const filterManager = {
    features: ['search', 'sort', 'filters'],
    container: '#task-container',
    searchFields: ['name', 'description', 'category'],
    sortFields: {
        name: { selector: '.card-title', type: 'text' },
        date: { selector: '.task-date', type: 'date' }
    }
};
```

### Search Module - Searching

**Functionalities:**
- Text search in tasks
- Real-time result filtering
- Found element counting

**Implementation:**
```javascript
function performSearch(text) {
    const tasks = findAllTasks();
    let found = 0;
    
    tasks.forEach(task => {
        const taskName = task.querySelector('.card-title').textContent;
        const taskDescription = task.querySelector('.task-description').textContent;
        const allText = (taskName + ' ' + taskDescription).toLowerCase();
        
        if (allText.includes(text.toLowerCase())) {
            showElement(task);
            found++;
        } else {
            hideElement(task);
        }
    });
    
    document.querySelector('.search-results').textContent = 
        `Found ${found} tasks`;
}
```

### Sort Module - Sorting

**Functionalities:**
- Sorting by various criteria
- Support for different data types
- Sort direction management

**Implementation:**
```javascript
function sortTasks(field, direction = 'ascending') {
    const tasks = Array.from(findAllTasks());
    
    tasks.sort((a, b) => {
        let valueA, valueB;
        
        if (field === 'name') {
            valueA = a.querySelector('.card-title').textContent;
            valueB = b.querySelector('.card-title').textContent;
        } else if (field === 'date') {
            valueA = new Date(a.querySelector('.task-date').textContent);
            valueB = new Date(b.querySelector('.task-date').textContent);
        }
        
        if (direction === 'ascending') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
    
    const container = document.querySelector('#task-container');
    tasks.forEach(task => container.appendChild(task));
}
```

---

## Event Management

### Event Delegation System

**Implementation:**
```javascript
// Central event listener
document.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    
    switch(action) {
        case 'toggle-theme':
            changeTheme();
            break;
        case 'search-clear':
            clearSearch();
            break;
        case 'filter-reset':
            resetFilters();
            break;
    }
});
```

### Event Handler Registration
```javascript
function registerActionHandler(actionName, handler) {
    actionHandlers[actionName] = handler;
}
```

---

## Adding Functionality

### Adding a New Action

**Step 1: HTML**
```html
<button data-action="custom-action" data-task-id="123">
    Custom action
</button>
```

**Step 2: JavaScript**
```javascript
registerActionHandler('custom-action', (element, eventType, data) => {
    const taskId = data.taskId;
    // Logic implementation
});
```

### Adding a New Search Field

**Step 1: HTML**
```html
<div class="task-item" data-field="priority">
    <span class="task-priority">High</span>
</div>
```

**Step 2: Configuration**
```javascript
const config = {
    searchFields: ['name', 'description', 'priority'],
    sortFields: {
        priority: {
            selector: '.task-priority',
            type: 'text',
            transform: text => {
                const priorities = { 'Low': 1, 'Medium': 2, 'High': 3 };
                return priorities[text] || 0;
            }
        }
    }
};
```

### Adding a New Module

**Step 1: File Creation**
```javascript
// public/js/custom-module.js
export default {
    init() {
        this.setupEventListeners();
    },
    
    mainFunction() {
        // Functionality implementation
    },
    
    setupEventListeners() {
        document.addEventListener('click', (event) => {
            if (event.target.dataset.action === 'custom-action') {
                this.mainFunction();
            }
        });
    }
};
```

**Step 2: Import**
```javascript
import customModule from './custom-module.js';

document.addEventListener('DOMContentLoaded', () => {
    customModule.init();
});
```

---

## Coding Conventions

### File Organization
```javascript
// 1. Imports at the beginning
import { helper1, helper2 } from './utils/helpers.js';

// 2. Constants
const CONSTANTS = {
    TIMEOUT: 300,
    CSS_CLASSES: {
        ACTIVE: 'active',
        HIDDEN: 'hidden'
    }
};

// 3. Helper functions
function helper1() { /* implementation */ }
function helper2() { /* implementation */ }

// 4. Main functions
function mainFunction() { /* implementation */ }

// 5. Export
export { mainFunction };
```

### Naming Conventions
- **Constants**: `UPPER_SNAKE_CASE`
- **Variables**: `camelCase`
- **Functions**: `camelCase`
- **Files**: `kebab-case.js`

### Function Documentation
```javascript
/**
 * Searches for tasks matching the given text
 * @param {string} searchText - Text to search for
 * @param {Array} tasks - List of tasks to search through
 * @returns {Array} List of matching tasks
 */
function searchTasks(searchText, tasks) {
    return tasks.filter(task => {
        const taskName = task.querySelector('.card-title').textContent;
        return taskName.toLowerCase().includes(searchText.toLowerCase());
    });
}
```

---

## Troubleshooting

### Problem: Search Not Working

**Diagnostics:**
```javascript
// Element verification
const searchField = document.querySelector('.search-input');
console.log('Search field:', searchField);

const tasks = document.querySelectorAll('.task-item');
console.log('Task count:', tasks.length);

// Function call verification
document.querySelector('.search-input').addEventListener('input', (e) => {
    console.log('Searching:', e.target.value);
});
```

### Problem: Theme Resets

**Diagnostics:**
```javascript
// localStorage verification
console.log('Saved theme:', localStorage.getItem('theme'));

// Module loading verification
if (typeof changeTheme === 'undefined') {
    console.error('Theme.js module not loaded');
}
```

### Problem: Incorrect Sorting

**Diagnostics:**
```javascript
// Configuration verification
const config = getConfig();
console.log('Sort configuration:', config.sortFields);

// Selector verification
const testElement = document.querySelector('.task-date');
console.log('Date element:', testElement);
```

### Debug Mode
```javascript
// Enable detailed logging
localStorage.setItem('debug', 'true');
```

---

## System Development

### Planned Functionalities
- Real-time synchronization
- Mobile application
- Task categories
- Calendar view
- Notification system
- Productivity reports
- Custom themes

### Technical Improvements
- Faster module loading
- Additional security measures
- Offline mode support
- Enhanced search
- Automated testing

### Considered Technologies
- TypeScript for type safety
- Web Components for better encapsulation
- Service Worker for offline functionality
- Virtual Scrolling for large lists

---

## Summary

The frontend JavaScript system implements a modern modular architecture with the following advantages:

- **Modularity** - Clear separation of responsibilities
- **Scalability** - Easy addition of new functionalities
- **Performance** - Optimizations for fast operation
- **Maintainability** - Readable and well-documented code
- **Reliability** - Thoughtful error handling

Documentation should be updated with each architectural change or addition of new functionalities.