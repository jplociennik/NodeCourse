// Search and Sort functionality for tasks page - Client-side filtering

/**
 * Applies search and sort filters without page reload
 */
function applyFilters() {
    const searchValue = document.getElementById('searchInput')?.value.trim().toLowerCase() || '';
    const sortValue = document.getElementById('sortSelect')?.value || '';
    
    // Get all task cards
    const taskCards = document.querySelectorAll('.task-card');
    const taskContainer = document.querySelector('.row');
    let visibleTasks = [];
    
    // First, filter tasks based on search
    taskCards.forEach(card => {
        const taskName = card.querySelector('.card-title')?.textContent.trim().toLowerCase() || '';
        const matchesSearch = !searchValue || taskName.includes(searchValue);
        
        if (matchesSearch) {
            card.closest('.col-md-6').style.display = 'block';
            visibleTasks.push(card.closest('.col-md-6'));
        } else {
            card.closest('.col-md-6').style.display = 'none';
        }
    });
    
    // Then, sort visible tasks
    if (sortValue && visibleTasks.length > 0) {
        const [field, direction] = sortValue.split('|');
        
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
    }
    
    // Update URL without reload
    updateURL(searchValue, sortValue);
    
    // Update task count and statistics
    updateTaskCount();
    updateStatistics();
}

/**
 * Clears all filters without page reload
 */
function clearFilters() {
    // Clear inputs
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    if (searchInput) searchInput.value = '';
    if (sortSelect) sortSelect.value = '';
    
    // Show all tasks
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => {
        card.closest('.col-md-6').style.display = 'block';
    });
    
    // Update URL
    updateURL('', '');
    
    // Update counts
    updateTaskCount();
    updateStatistics();
}

/**
 * Updates URL without page reload
 */
function updateURL(searchValue, sortValue) {
    const params = new URLSearchParams();
    
    if (searchValue) {
        params.set('q', searchValue);
    }
    
    if (sortValue) {
        params.set('sort', sortValue);
    }
    
    const currentPath = window.location.pathname;
    const newUrl = params.toString() ? `${currentPath}?${params.toString()}` : currentPath;
    
    history.replaceState(null, '', newUrl);
}

/**
 * Updates the task count display
 */
function updateTaskCount() {
    const visibleTasks = document.querySelectorAll('.col-md-6:not([style*="display: none"]) .task-card');
    const taskCountBadge = document.querySelector('.task-count');
    
    if (taskCountBadge) {
        taskCountBadge.textContent = visibleTasks.length;
    }
}

/**
 * Initialize filters from URL parameters on page load
 */
function initializeFiltersFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchValue = urlParams.get('q') || '';
    const sortValue = urlParams.get('sort') || '';
    
    // Set input values
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    if (searchInput && searchValue) {
        searchInput.value = searchValue;
    }
    
    if (sortSelect && sortValue) {
        sortSelect.value = sortValue;
    }
    
    // Apply filters if there are any parameters
    if (searchValue || sortValue) {
        applyFilters();
    }
}

// Initialize search and sort functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    // Enter key support for search
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    }
    
    // Initialize filters from URL
    initializeFiltersFromURL();
    
    console.log('Filters script loaded');
}); 