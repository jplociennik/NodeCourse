// =============================================================================
// TASK CONTROLLER CONFIGURATION
// =============================================================================

const FilterConfigService = require('../../services/filter-config-service.js');

/**
 * Configuration functions for task controller
 * Contains all configuration-related logic separated from main controller
 */

const TaskControllerConfig = {

  /**
   * Gets sort options for tasks
   * @returns {Array} Array of sort options
   */
  getSortOptions: async () => {
    return [
      { value: '', text: 'Domyślne', field: null, direction: null },
      { value: 'taskName|asc', text: 'Nazwa A-Z', field: 'taskName', direction: 'asc' },
      { value: 'taskName|desc', text: 'Nazwa Z-A', field: 'taskName', direction: 'desc' },
      { value: 'dateFrom|asc', text: 'Data od najstarszej', field: 'dateFrom', direction: 'asc' },
      { value: 'dateFrom|desc', text: 'Data od najnowszej', field: 'dateFrom', direction: 'desc' },
      { value: 'isDone|asc', text: 'Nie wykonane najpierw', field: 'isDone', direction: 'asc' },
      { value: 'isDone|desc', text: 'Wykonane najpierw', field: 'isDone', direction: 'desc' }
    ];
  },

  /**
   * Gets sort fields configuration for tasks
   * @returns {Object} Sort fields configuration
   */
  getSortFieldsConfig: async () => {
    return FilterConfigService.createSortFieldsConfig({
      taskName: 'text',
      dateFrom: 'date',
      isDone: 'checkbox'
    });
  },

  /**
   * Gets filter options for tasks
   * @returns {Array} Array of filter options
   */
  getFilterOptions: async () => {
    return [
      {
        id: 'status',
        label: 'Status zadania',
        type: 'checkbox-group',
        options: [
          { value: 'done', label: 'Wykonane', field: 'isDone', filterValue: true },
          { value: 'todo', label: 'Do wykonania', field: 'isDone', filterValue: false }
        ]
      },
      {
        id: 'dateFrom',
        label: 'Data od',
        type: 'date',
        field: 'dateFrom',
        placeholder: 'Wybierz datę od'
      },
      {
        id: 'dateTo', 
        label: 'Data do',
        type: 'date',
        field: 'dateTo',
        placeholder: 'Wybierz datę do'
      }
    ];
  },

  /**
   * Gets complete filter configuration for tasks
   * @returns {Object} Complete filter configuration
   */
  getFilterConfig: async () => {
    return FilterConfigService.createFilterConfig({
      formAction: '/zadania/user',
      sortOptions: await TaskControllerConfig.getSortOptions(),
      filterOptions: await TaskControllerConfig.getFilterOptions(),
      searchConfig: {
        placeholder: 'Wpisz nazwę zadania...',
        label: 'Szukaj zadań'
      }
    });
  },

  /**
   * Gets form configuration for task forms
   * @param {string} type - Form type ('add' or 'edit')
   * @param {Object} req - Express request object
   * @param {Object} task - Task object (for edit form)
   * @returns {Object} Form configuration
   */
  getFormConfig: async (type, req, task = null) => {
    const isEdit = type === 'edit';
    
    return {
      template: isEdit ? 'pages/task/task-edit' : 'pages/task/task-add',
      pageTitle: isEdit ? 'Edytuj zadanie' : 'Dodaj zadanie',
      pageName: 'tasks',
      formTitle: isEdit ? 'Edytuj zadanie' : 'Dodaj nowe zadanie',
      formAction: isEdit ? `/zadania/user/${req.params?.id || task?._id}/edytuj` : '/zadania/user/dodaj',
      submitText: isEdit ? 'Zaktualizuj zadanie' : 'Dodaj zadanie',
      task: task || req.body || {}
    };
  }

};

module.exports = { TaskControllerConfig }; 