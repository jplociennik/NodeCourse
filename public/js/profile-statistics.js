// Profile-specific updateStatistics function
function updateStatistics() {
    const totalItems = document.querySelectorAll('.profile-item').length;
    const visibleItems = document.querySelectorAll('.profile-item:not([style*="display: none"])').length;
    
    // Update statistics in sidebar
    const totalCountEl = document.getElementById('totalCount');
    const visibleCountEl = document.getElementById('visibleCount');
    
    if (totalCountEl) totalCountEl.textContent = totalItems;
    if (visibleCountEl) visibleCountEl.textContent = visibleItems;
    
    // Show/hide no results message
    const noResults = document.getElementById('noResults');
    if (noResults) {
        if (visibleItems === 0 && totalItems > 0) {
            noResults.classList.remove('d-none');
        } else {
            noResults.classList.add('d-none');
        }
    }
} 