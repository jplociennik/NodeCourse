import { d, onReady } from '../utils/helpers.js';
import { FilterManager } from './filter-manager.js';

// =============================================================================
// FILTER INITIALIZATION FUNCTIONS
// =============================================================================

/**
 * Parse filter configuration from DOM element
 * @param {HTMLElement} configElement - Element containing JSON config
 * @returns {Object|null} Parsed config or null if failed
 */
const parseFilterConfig = (configElement) => {
    try 
    {
        return JSON.parse(configElement.textContent);
    } 
    catch (error) {
        console.error('Invalid filter config JSON:', error); return null;
    }
};

/**
 * Initialize filter system with configuration
 * @param {Object} config - Filter configuration object
 */
const initializeFilterSystem = (config) => {
    const filterManager = FilterManager(config);
    filterManager.init();
};

// =============================================================================
// INITIALIZATION
// =============================================================================

onReady(() => {
    const configElement = d.querySelector('#filterConfig');
    if (!configElement) return;
    
    const config = parseFilterConfig(configElement);
    if (config) {
        initializeFilterSystem(config);
    }
}); 