// Standalone search functionality
document.addEventListener('DOMContentLoaded', function() {
    // For standalone use, create minimal manager
    window.filterManager = {
        modules: {
            search: new SearchModule({
                updateURL: () => {},
                updateCounts: () => {}
            })
        }
    };
    
    window.performSearch = function() {
        window.filterManager.modules.search.performSearch(
            document.getElementById('searchInput').value
        );
    };
}); 