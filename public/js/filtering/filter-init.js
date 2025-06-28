// Filter system initialization
document.addEventListener('DOMContentLoaded', function() {
    const configElement = document.getElementById('filterConfig');
    
    if (configElement) {
        try {
            const config = JSON.parse(configElement.textContent);
            window.filterManager = new FilterManager(config);
        } catch (error) {
            console.error('Failed to initialize FilterManager:', error);
        }
    }
}); 