// Search functionality - Browser Extension Safe - Client-side filtering
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        console.warn('searchInput element not found');
        return;
    }
    
    const searchValue = searchInput.value.trim().toLowerCase() || '';
    
    // Get all task cards
    const taskCards = document.querySelectorAll('.task-card');
    
    // Filter tasks based on search
    taskCards.forEach(card => {
        const taskName = card.querySelector('.card-title')?.textContent.trim().toLowerCase() || '';
        const matchesSearch = !searchValue || taskName.includes(searchValue);
        
        if (matchesSearch) {
            card.closest('.col-md-6').style.display = 'block';
        } else {
            card.closest('.col-md-6').style.display = 'none';
        }
    });
    
    // Update URL without reload (preserve sort param if sortSelect exists)
    const params = new URLSearchParams();
    if (searchValue) {
        params.set('q', searchValue);
    }
    
    // Preserve sort parameter if sortSelect exists and has value
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect && sortSelect.value) {
        params.set('sort', sortSelect.value);
    }
    
    const currentPath = window.location.pathname;
    const newUrl = params.toString() ? `${currentPath}?${params.toString()}` : currentPath;
    history.replaceState(null, '', newUrl);
    
    // Update task count if it exists
    const visibleTasks = document.querySelectorAll('.col-md-6:not([style*="display: none"]) .task-card');
    const taskCountBadge = document.querySelector('.task-count');
    
    if (taskCountBadge) {
        taskCountBadge.textContent = visibleTasks.length;
    }
    
    // Update statistics if they exist
    if (typeof updateStatistics === 'function') {
        updateStatistics();
    }
}

/**
 * Initialize search from URL parameters on page load
 */
function initializeSearchFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchValue = urlParams.get('q') || '';
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchValue) {
        searchInput.value = searchValue;
        performSearch();
    }
}

// Initialize search functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Enter key support
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Initialize search from URL
    initializeSearchFromURL();
}); 