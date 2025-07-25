// =============================================================================
// TASK FORM IMAGE PREVIEW MODULE
// =============================================================================

import { onReady } from './utils/helpers.js';
import { validateFileType, handleFileValidationError, showStyledAlert } from './utils/alert-utils.js';

// =============================================================================
// CONSTANTS
// =============================================================================

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const ERROR_MESSAGE = 'Dozwolone są tylko pliki {types}!';

// =============================================================================
// IMAGE PREVIEW FUNCTIONS
// =============================================================================

/**
 * Handles image file selection and preview
 * @param {HTMLInputElement} imageInput - File input element
 * @param {HTMLElement} preview - Preview container
 * @param {HTMLImageElement} previewImg - Preview image element
 * @param {HTMLElement} oldImageContainer - Container for existing image
 */
const handleImageChange = (imageInput, preview, previewImg, oldImageContainer) => {
    const file = imageInput.files[0];
    
    if (file && !validateFileType(file, ALLOWED_IMAGE_TYPES)) {
        handleFileValidationError(imageInput, ERROR_MESSAGE, ['PNG', 'JPG', 'JPEG']);
        if (preview) {
            preview.style.display = 'none';
            previewImg.src = "";
        }
        return;
    }
    
    if (oldImageContainer) {
        oldImageContainer.style.display = file ? 'none' : '';
    }
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
        if (oldImageContainer) {
            oldImageContainer.style.display = '';
        }
    }
};

/**
 * Validates form submission for image files
 * @param {HTMLFormElement} form - Form element
 * @param {HTMLInputElement} imageInput - File input element
 */
const handleFormSubmit = (form, imageInput) => {
    if (!imageInput.files.length) return;
    
    const file = imageInput.files[0];
    if (file && !validateFileType(file, ALLOWED_IMAGE_TYPES)) {
        event.preventDefault();
        showStyledAlert(ERROR_MESSAGE.replace('{types}', 'PNG, JPG, JPEG'));
    }
};

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initializes the task form image preview functionality
 */
const initializeTaskForm = () => {
    const imageInput = document.getElementById('image');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const oldImageContainer = document.getElementById('oldImageContainer');
    const form = document.querySelector('#taskForm');

    if (!imageInput || !preview || !previewImg) return;

    // Handle image file selection
    imageInput.addEventListener('change', () => {
        handleImageChange(imageInput, preview, previewImg, oldImageContainer);
    });

    // Handle form submission validation
    if (form) {
        form.addEventListener('submit', (e) => {
            handleFormSubmit(form, imageInput);
        });
    }
};

// =============================================================================
// MODULE INITIALIZATION
// =============================================================================

onReady(initializeTaskForm); 