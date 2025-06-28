// Sort functionality for standalone use - Client-side sorting
function performSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) {
        console.warn('sortSelect element not found');
        return;
    }
    
    const sortValue = sortSelect.value || '';
    
    if (!sortValue) {
        clearSort();
        return;
    }
    
    const [field, direction] = sortValue.split('|');
    const taskContainer = document.querySelector('.row');
    const visibleTasks = Array.from(document.querySelectorAll('.col-md-6:not([style*="display: none"])'));
    
    if (visibleTasks.length === 0) return;
    
    // Sort visible tasks
    visibleTasks.sort((a, b) => {
        let valueA, valueB;
        
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
        
        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    // Reorder DOM elements
    const parent = visibleTasks[0].parentNode;
    visibleTasks.forEach(task => {
        parent.appendChild(task);
    });
    
    // Update URL without reload (preserve search param if searchInput exists)
    const params = new URLSearchParams();
    if (sortValue) {
        params.set('sort', sortValue);
    }
    
    // Preserve search parameter if searchInput exists and has value
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value.trim()) {
        params.set('q', searchInput.value.trim());
    }
    
    const currentPath = window.location.pathname;
    const newUrl = params.toString() ? `${currentPath}?${params.toString()}` : currentPath;
    history.replaceState(null, '', newUrl);
}

function clearSort() {
    // Clear sort select if it exists
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = '';
    }
    
    // Clear search input only if it exists (optional dependency)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Show all tasks
    const allTasks = Array.from(document.querySelectorAll('.col-md-6'));
    allTasks.forEach(task => {
        task.style.display = 'block';
    });
    
    // Update statistics if function exists (from tasks.js)
    if (typeof updateStatistics === 'function') {
        updateStatistics();
    }
    
    // Update task count if element exists
    const taskCountBadge = document.querySelector('.task-count');
    if (taskCountBadge) {
        taskCountBadge.textContent = allTasks.length;
    }
    
    // Update URL
    history.replaceState(null, '', window.location.pathname);
}

/**
 * Initialize sort from URL parameters on page load
 */
function initializeSortFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const sortValue = urlParams.get('sort') || '';
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect && sortValue) {
        sortSelect.value = sortValue;
        performSort();
    }
}

// Initialize sort functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sort from URL
    initializeSortFromURL();
    
    console.log('Sort script loaded');
}); 