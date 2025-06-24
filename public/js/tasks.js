// Task management JavaScript functions

// Constants for better maintainability
const TASK_API = {
    TOGGLE: (id) => `/zadania/admin/${id}/toggle`,
    DELETE: (id) => `/zadania/admin/${id}/usun`
};

const MESSAGES = {
    ERROR: 'Błąd podczas aktualizacji zadania',
    NETWORK_ERROR: 'Błąd połączenia z serwerem'
};

const CSS_CLASSES = {
    BADGE_SUCCESS: 'badge bg-success',
    BADGE_WARNING: 'badge bg-warning',
    ICON_SUCCESS: 'bi bi-check-circle text-success',
    ICON_MUTED: 'bi bi-check-circle text-muted'
};

const TASK_STATUS = {
    DONE: 'Wykonane',
    TODO: 'Do wykonania'
};

/**
 * Sets up the delete confirmation modal with task information
 * @param {string} taskId - The ID of the task to delete
 * @param {string} taskName - The name of the task to display in modal
 */
function setDeleteTask(taskId, taskName) {
    const taskNameElement = document.getElementById('taskToDelete');
    const confirmButton = document.getElementById('confirmDeleteBtn');
    
    if (!taskNameElement || !confirmButton) {
        console.error('Delete modal elements not found');
        return;
    }
    
    taskNameElement.textContent = taskName;
    confirmButton.href = TASK_API.DELETE(taskId);
}

/**
 * Toggles task completion status via API call
 * @param {string} taskId - The ID of the task to toggle
 * @param {HTMLInputElement} checkbox - The checkbox element that triggered the change
 */
async function toggleTaskStatus(taskId, checkbox) {
    const originalState = checkbox.checked;
    
    try {
        const response = await fetch(TASK_API.TOGGLE(taskId), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            updateTaskUI(taskId, data.isDone);
        } else {
            throw new Error(data.error || MESSAGES.ERROR);
        }
        
    } catch (error) {
        console.error('Error toggling task status:', error);
        
        // Revert checkbox state
        checkbox.checked = !originalState;
        
        // Show user-friendly error message
        const errorMessage = error.message.includes('Failed to fetch') 
            ? MESSAGES.NETWORK_ERROR 
            : MESSAGES.ERROR;
            
        showErrorMessage(errorMessage);
    }
}

/**
 * Updates the UI elements to reflect the new task status
 * @param {string} taskId - The ID of the task
 * @param {boolean} isDone - Whether the task is completed
 */
function updateTaskUI(taskId, isDone) {
    // Update status badge
    const statusBadge = document.getElementById(`status-${taskId}`);
    if (statusBadge) {
        statusBadge.textContent = isDone ? TASK_STATUS.DONE : TASK_STATUS.TODO;
        statusBadge.className = isDone ? CSS_CLASSES.BADGE_SUCCESS : CSS_CLASSES.BADGE_WARNING;
    }
    
    // Update title icon
    const titleIcon = document.querySelector(`#task-${taskId}`)
        ?.closest('.card-body')
        ?.querySelector('.bi-check-circle');
        
    if (titleIcon) {
        titleIcon.className = isDone ? CSS_CLASSES.ICON_SUCCESS : CSS_CLASSES.ICON_MUTED;
    }
}

/**
 * Shows an error message to the user
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
    // You could replace this with a more sophisticated notification system
    // like toast notifications, modal alerts, etc.
    alert(message);
}

// Initialize any event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Task management script loaded');
    
    // You could add global error handling, keyboard shortcuts, etc. here
    // Example: Add keyboard shortcut for quick task completion
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to toggle first visible task (example)
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const firstCheckbox = document.querySelector('input[type="checkbox"][id^="task-"]');
            if (firstCheckbox) {
                firstCheckbox.click();
                e.preventDefault();
            }
        }
    });
}); 