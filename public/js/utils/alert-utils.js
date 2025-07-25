// =============================================================================
// ALERT & MODAL UTILITIES MODULE
// Centralized alert and modal management for all components
// =============================================================================

import { d, setText } from './helpers.js';

// =============================================================================
// CONSTANTS
// =============================================================================

const ALERT_TYPES = {
    ERROR: 'error',
    SUCCESS: 'success',
    WARNING: 'warning',
    INFO: 'info'
};

const ALERT_CLASSES = {
    ERROR: 'alert alert-danger',
    SUCCESS: 'alert alert-success',
    WARNING: 'alert alert-warning',
    INFO: 'alert alert-info'
};



// =============================================================================
// MODAL FUNCTIONS
// =============================================================================

/**
 * Shows an error message using Bootstrap modal
 * @param {string} message - The error message to display
 * @param {string} title - Optional title for the error modal (default: 'Błąd')
 */
const showErrorModal = (message, title = 'Błąd') => {
    const errorModal = d.querySelector('#errorModal');
    const errorTitle = d.querySelector('#errorModalTitle');
    const errorMessage = d.querySelector('#errorModalMessage');
    
    if (errorModal && setText(errorTitle, title) && setText(errorMessage, message)) {
        new bootstrap.Modal(errorModal).show();
    } else {
        console.error('Error modal elements not found, falling back to alert');
        alert(`${title}: ${message}`);
    }
};

// =============================================================================
// INLINE ALERT FUNCTIONS
// =============================================================================

/**
 * Shows a styled inline alert message
 * @param {string} message - The message to display
 * @param {string} type - Alert type (error, success, warning, info)
 * @param {Object} options - Additional options
 * @param {string} options.containerSelector - Selector for container to insert alert
 * @param {string} options.alertClass - Custom CSS class for the alert
 * @param {boolean} options.autoRemove - Whether to automatically remove after delay
 * @param {number} options.removeDelay - Delay before auto-removal (ms)
 * @param {boolean} options.scrollTo - Whether to scroll to the alert
 * @returns {HTMLElement} The created alert element
 */
const showInlineAlert = (message, type = ALERT_TYPES.ERROR, options = {}) => {
    const {
        containerSelector = 'body',
        alertClass = '',
        autoRemove = false,
        removeDelay = 5000,
        scrollTo = false
    } = options;

    // Remove existing alerts of the same type
    const existingAlert = d.querySelector(`.${alertClass || 'custom-alert'}`);
    if (existingAlert) existingAlert.remove();

    const container = d.querySelector(containerSelector);
    if (!container) {
        console.error(`Container not found: ${containerSelector}`);
        return null;
    }

    const alertDiv = d.createElement('div');
    alertDiv.className = `${ALERT_CLASSES[type.toUpperCase()]} custom-alert mt-3 ${alertClass}`;
    
    const iconClass = type === ALERT_TYPES.ERROR ? 'bi-exclamation-triangle' : 
                     type === ALERT_TYPES.SUCCESS ? 'bi-check-circle' :
                     type === ALERT_TYPES.WARNING ? 'bi-exclamation-triangle' : 'bi-info-circle';
    
    alertDiv.innerHTML = `<i class="bi ${iconClass}"></i> ${message}`;

    // Insert alert into container
    container.parentNode.insertBefore(alertDiv, container);

    // Scroll to alert if requested
    if (scrollTo) {
        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Auto-remove if requested
    if (autoRemove) {
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, removeDelay);
    }

    return alertDiv;
};

/**
 * Shows a styled error alert (legacy compatibility)
 * @param {string} message - The error message
 * @param {Object} options - Alert options
 * @returns {HTMLElement} The created alert element
 */
const showStyledAlert = (message, options = {}) => {
    return showInlineAlert(message, ALERT_TYPES.ERROR, {
        containerSelector: '#taskForm',
        alertClass: 'custom-upload-alert',
        scrollTo: true,
        ...options
    });
};

/**
 * Removes all custom alerts
 * @param {string} alertClass - Optional specific alert class to remove
 */
const removeAlerts = (alertClass = 'custom-alert') => {
    const alerts = d.querySelectorAll(`.${alertClass}`);
    alerts.forEach(alert => alert.remove());
};

// =============================================================================
// FILE VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validates file type for uploads
 * @param {File} file - File to validate
 * @param {Array<string>} allowedTypes - Array of allowed MIME types
 * @returns {boolean} Whether file type is valid
 */
const validateFileType = (file, allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']) => {
    return file && allowedTypes.includes(file.type);
};

/**
 * Shows file validation error and clears input
 * @param {HTMLInputElement} fileInput - File input element
 * @param {string} message - Error message
 * @param {Array<string>} allowedTypes - Allowed file types for message
 */
const handleFileValidationError = (fileInput, message, allowedTypes = ['PNG', 'JPG', 'JPEG']) => {
    const typeList = allowedTypes.join(', ');
    const fullMessage = message.replace('{types}', typeList);
    
    showStyledAlert(fullMessage);
    
    if (fileInput) {
        fileInput.value = '';
    }
};

// =============================================================================
// EXPORTS
// =============================================================================

export {
    ALERT_TYPES,
    ALERT_CLASSES,
    showErrorModal,
    showInlineAlert,
    showStyledAlert,
    removeAlerts,
    validateFileType,
    handleFileValidationError
}; 