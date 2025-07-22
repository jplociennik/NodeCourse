// =============================================================================
// TASK CONTROLLER
// =============================================================================

const { Task } = require('../../db/mongoose');
const { User } = require('../../db/mongoose');
const { ErrorController } = require('../error-controller');
const { removeTaskImage } = require('../../services/image-service');
const TaskFilterService = require('../../services/task-filter-service.js');
const CsvExportService = require('../../services/csv-export-service.js');
const { TaskControllerConfig } = require('./task-controller-config.js');
const { sampleTasks } = require('../../db/sample-tasks');

const TaskController = {

  // =============================================================================
  // ROUTING FUNCTIONS
  // =============================================================================

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
            filterConfig: await TaskControllerConfig.getFilterConfig(),
            statisticsConfig: statisticsConfig
        });
    } catch (error) {
        ErrorController.handleError(res, error);
    }
  },

  showAddTaskForm: async (req, res) => {
    try {
      const formConfig = await TaskControllerConfig.getFormConfig('add', req);
      await res.render(formConfig.template, formConfig);
        
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

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

  generateSampleTasks: async (req, res) => {
    try {
      const userId = req.session.userId;
      
      // Check if user already has sample tasks
      const existingTasks = await Task.find({ user: userId });
      if (existingTasks.length > 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Użytkownik już ma zadania. Nie można wygenerować przykładowych zadań.' 
        });
      }

      // Generate sample tasks for the user
      const userSampleTasks = sampleTasks.map(task => ({
        ...task,
        user: userId
      }));

      await Task.insertMany(userSampleTasks);

      // Mark user as having generated sample tasks
      await User.findByIdAndUpdate(userId, { hasGeneratedSampleTasks: true });

      res.json({ success: true, message: 'Przykładowe zadania zostały wygenerowane' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Błąd podczas generowania przykładowych zadań' });
    }
  },

  // =============================================================================
  // CSV EXPORT FUNCTIONS
  // =============================================================================

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