// =============================================================================
// TASK CONTROLLER
// =============================================================================

const { Task } = require('../../db/mongoose');
const { User } = require('../../db/mongoose');
const { ErrorController } = require('../error-controller');
const { removeTaskImage } = require('../../services/image-service');
const TaskFilterService = require('./task-filter.js');
const CsvExportService = require('../../services/csv-export-service.js');
const { TaskControllerConfig } = require('./task-controller-config.js');
const { sampleTasks } = require('../../db/sample-tasks');

const TaskController = {

  // =============================================================================
  // ROUTING FUNCTIONS
  // =============================================================================

  /**
   * Gets tasks page with filtering and pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getTasksPage: async (req, res) => {
    try {
        // Save advanced filters state to session
        TaskFilterService.saveFilterState(req.session, req.query);
        
        // Get advanced filters state from session
        const filterState = TaskFilterService.getFilterState(req.session);
        
        // Merge query parameters with filter state
        const params = { ...req.query, ...filterState };
        
        // Get filtered tasks using the service
        const { tasks, paginationConfig, statisticsConfig } = await TaskFilterService.getFilteredTasks(params, req.session.userId);

        // Check if user has generated sample tasks
        const user = await User.findById(req.session.userId);
        const hasGeneratedSampleTasks = user ? user.hasGeneratedSampleTasks : false;

        await res.render('pages/task/tasks', { 
            pageTitle: 'Zadania',
            pageName: 'tasks',
            title: 'Lista zadań',
            subtitle: 'Przegląd aktualnych zadań',
            heroIcon: 'bi bi-list-check',
            breadcrumbs: [
                {
                    text: 'Zadania',
                    icon: 'bi bi-list-check'
                }
            ],
            tasks: tasks,
            query: params, // Merge req.query with advanced filters state
            hasGeneratedSampleTasks: hasGeneratedSampleTasks,
            paginationConfig: paginationConfig,
            mainFilterConfig: TaskControllerConfig.getMainFilterConfig(),
            statisticsConfig: statisticsConfig
        });
    } catch (error) {
        ErrorController.handleError(res, error);
    }
  },

  /**
   * Shows add task form
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  showAddTaskForm: async (req, res) => {
    try {
      const formConfig = await TaskControllerConfig.getFormConfig('add', req);
      await res.render(formConfig.template, formConfig);
        
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  /**
   * Adds new task to database
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  addTask: async (req, res) => {
    try {
      const { taskName, dateFrom, dateTo } = req.body;
      const task = new Task({  
        taskName,  
        dateFrom,  
        dateTo: dateTo || null,
        isDone: false,
        user: req.session.userId,
        image: req.file?.filename || null
      });

      await task.save();
      res.redirect('/zadania/user');
    } catch (error) {
      const formConfig = await TaskControllerConfig.getFormConfig('add', req);
      ErrorController.handleValidationError(res, error, formConfig);
    }
  },

  /**
   * Shows edit task form
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  showEditTaskForm: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).render('errors/404', {
          pageTitle: 'Zadanie nie znalezione'
        });
      }

      const formConfig = await TaskControllerConfig.getFormConfig('edit', req, task);
      await res.render(formConfig.template, formConfig);

    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  /**
   * Updates existing task in database
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  editTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { taskName, dateFrom, dateTo } = req.body;
      const task = await Task.findById(id);

      if (req.file?.filename && task.image) removeTaskImage(task.image);

      await Task.findByIdAndUpdate(id, {  
        taskName,  
        dateFrom,  
        dateTo: dateTo || null,
        user: req.session.userId,
        image: req.file?.filename || task.image
      });

      res.redirect('/zadania/user');
    } catch (error) {
      const formConfig = await TaskControllerConfig.getFormConfig('edit', req);
      ErrorController.handleValidationError(res, error, formConfig);
    }
  },

  /**
   * Deletes task from database
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);

      if (task.image) removeTaskImage(task.image);

      await Task.findByIdAndDelete(id);
      res.redirect('/zadania/user');
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  /**
   * Removes image from task
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deleteImage: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      
      if (task.image) {
        removeTaskImage(task.image);
        task.image = null;
        await task.save();
      }

      res.redirect(`/zadania/user/${id}/edytuj`);
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  /**
   * Toggles task completion status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  toggleTaskStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      
      if (!task) {
        return res.status(404).json({ success: false, error: 'Zadanie nie znalezione' });
      }

      task.isDone = !task.isDone;
      await task.save();

      res.json({ success: true, isDone: task.isDone });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Błąd podczas aktualizacji zadania' });
    }
  },

  /**
   * Generates sample tasks for current user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  generateSampleTasks: async (req, res) => {
    try {
      const userId = req.session.userId;
      
      // Check if user has already generated sample tasks
      const user = await User.findById(userId);
      if (user && user.hasGeneratedSampleTasks) {
        req.flash('error', 'Przykładowe zadania zostały już wygenerowane dla tego użytkownika.');
        return res.redirect('/zadania/user/');
      }

      // Generate sample tasks for the user
      const userSampleTasks = sampleTasks.map(task => ({
        ...task,
        user: userId
      }));

      await Task.insertMany(userSampleTasks);

      // Mark user as having generated sample tasks
      await User.findByIdAndUpdate(userId, { hasGeneratedSampleTasks: true });

      req.flash('success', 'Przykładowe zadania zostały wygenerowane pomyślnie!');
      res.redirect('/zadania/user/');
    } catch (error) {
      req.flash('error', 'Błąd podczas generowania przykładowych zadań');
      res.redirect('/zadania/user/');
    }
  },

  // =============================================================================
  // CSV EXPORT FUNCTIONS
  // =============================================================================

  /**
   * Exports filtered tasks to CSV format
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  exportFilteredTasks: async (req, res) => {
    try {
      // Get advanced filters state from session
      const filterState = TaskFilterService.getFilterState(req.session);
      
      // Merge query parameters with filter state
      const params = { ...req.query, ...filterState };
      
      // Get filtered tasks using the service (without pagination)
      const { tasks } = await TaskFilterService.getFilteredTasks(params, req.session.userId, true);
      
      // Export filtered tasks to CSV
      const csv = await CsvExportService.exportFilteredTasksToCsv(tasks, res, params);
      res.send(csv);
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  /**
   * Exports all user tasks to CSV format
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  exportAllTasks: async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.session.userId });
      const csv = await CsvExportService.exportTasksToCsv(tasks, res);
      res.send(csv);
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

};

module.exports = { TaskController }; 