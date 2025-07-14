// =============================================================================
// SCROLL POSITION MANAGER
// =============================================================================

/**
 * Saves current scroll position to sessionStorage
 */
const saveScrollPosition = () => {
    sessionStorage.setItem('scrollY', window.scrollY);
    sessionStorage.setItem('scrollTimestamp', Date.now());
};

/**
 * Restores scroll position from sessionStorage if it was saved recently
 */
const restoreScrollPosition = () => {
    const scrollY = sessionStorage.getItem('scrollY');
    const scrollTimestamp = sessionStorage.getItem('scrollTimestamp');
    
    // Check if scroll was saved within last 5 seconds (page was reloaded)
    if (scrollY !== null && scrollTimestamp && (Date.now() - parseInt(scrollTimestamp)) < 5000) {
        setTimeout(() => {
            window.scrollTo(0, parseInt(scrollY, 10));
            sessionStorage.removeItem('scrollY');
            sessionStorage.removeItem('scrollTimestamp');
        }, 10);
    }
};

/**
 * Sets up scroll position management for all forms on the page
 */
const setupScrollPositionManagement = () => {
    // Save scroll position before form submission
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', saveScrollPosition);
    });

    // Restore scroll position after page load
    window.addEventListener('load', restoreScrollPosition);
};

/**
 * Initializes scroll position management when DOM is ready
 */
const initScrollManager = () => {
    setupScrollPositionManagement();
    console.log('Scroll position manager initialized');
};

// =============================================================================
// EXPORTS
// =============================================================================

export { 
    saveScrollPosition, 
    restoreScrollPosition, 
    setupScrollPositionManagement, 
    initScrollManager 
}; 