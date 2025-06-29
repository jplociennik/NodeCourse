import { d, onReady } from '../utils/helpers.js';
import { FilterManager } from './filter-manager.js';

// Filter system initialization
onReady(() => {
    const configElement = d.querySelector('#filterConfig');
    
    if (configElement) {
        try {
            const config = JSON.parse(configElement.textContent);
            
            // Check if FilterManager is available
            if (typeof FilterManager !== 'undefined') {
                const filterManager = FilterManager(config);
                const initialized = filterManager.init();
                
                if (!initialized) {
                    console.warn('FilterManager initialization failed, using fallback functions');
                }
            } else {
                console.warn('FilterManager not available, using fallback functions');
            }
        } catch (error) {
            console.error('Failed to initialize FilterManager:', error);
        }
    } else {
        console.warn('No filter config found, skipping FilterManager initialization');
    }
}); 