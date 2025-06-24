// Search functionality - Browser Extension Safe
function performSearch() {
    const searchValue = document.getElementById('searchInput').value;
    const currentPath = window.location.pathname;
    const url = searchValue ? `${currentPath}?q=${encodeURIComponent(searchValue)}` : currentPath;
    window.location.href = url;
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
}); 