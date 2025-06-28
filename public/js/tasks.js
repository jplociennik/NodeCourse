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
    BADGE_SUCCESS: 'badge task-status bg-success',
    BADGE_WARNING: 'badge task-status bg-warning',
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
 * Sets initial colors for task titles based on their status
 */
function setInitialTaskColors() {
    // Find all task titles with muted icons (incomplete tasks)
    const incompleteTasks = document.querySelectorAll('.bi-check-circle.text-muted');
    
    incompleteTasks.forEach(icon => {
        const titleElement = icon.closest('.card-title');
        if (titleElement) {
            // Use !important to override Bootstrap's text-success
            titleElement.style.setProperty('color', '#369992', 'important');
            titleElement.classList.add('task-incomplete');
        }
    });
}

// Set colors when page loads
document.addEventListener('DOMContentLoaded', setInitialTaskColors);

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
    
    // Update title icon and title color
    const titleIcon = document.querySelector(`#task-${taskId}`)
        ?.closest('.card-body')
        ?.querySelector('.bi-check-circle');
        
    if (titleIcon) {
        titleIcon.className = isDone ? CSS_CLASSES.ICON_SUCCESS : CSS_CLASSES.ICON_MUTED;
        
        // Update title color based on task status
        const titleElement = titleIcon.closest('.card-title');
        if (titleElement) {
            if (isDone) {
                // Remove custom color and class for completed tasks
                titleElement.style.removeProperty('color');
                titleElement.classList.remove('task-incomplete');
            } else {
                // Set turkusowy color for incomplete tasks
                titleElement.style.setProperty('color', '#369992', 'important');
                titleElement.classList.add('task-incomplete');
            }
        }
    }
    
    // Update statistics
    updateStatistics();
}

/**
 * Updates the statistics counters in the sidebar
 */
function updateStatistics() {
    const todoCountElement = document.getElementById('todoCount');
    const doneCountElement = document.getElementById('doneCount');
    
    if (todoCountElement && doneCountElement) {
        // Count only visible checkboxes and their states
        const visibleCheckboxes = document.querySelectorAll('.col-md-6:not([style*="display: none"]) input[type="checkbox"][id^="task-"]');
        let todoCount = 0;
        let doneCount = 0;
        
        visibleCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                doneCount++;
            } else {
                todoCount++;
            }
        });
        
        todoCountElement.textContent = todoCount;
        doneCountElement.textContent = doneCount;
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