// =============================================================================
// LOADING STATE MANAGEMENT
// =============================================================================

import { d } from '../utils/helpers.js';

// =============================================================================
// CONSTANTS
// =============================================================================

const LOADING_DELAY = 2000;

const LOADING_HTML = `
    <div class="col-12 text-center py-5">
        <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Ładowanie...</span>
        </div>
        <p class="mt-2">Wyszukiwanie...</p>
    </div>
`;

// =============================================================================
// LOADING STATE FUNCTIONS
// =============================================================================

/**
 * Shows loading state in tasks container
 */
const showLoading = () => {
    const tasksContainer = d.querySelector('#tasksContainer');
    if (tasksContainer) {
        tasksContainer.innerHTML = LOADING_HTML;
    }
};

// =============================================================================
// EXPORTS
// =============================================================================

export { LOADING_DELAY, showLoading }; 