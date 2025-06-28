const { Task } = require('../db/mongoose');
const { ErrorController } = require('./error-controller');

const TaskController = {
  
  // Private functions
    getSortOptions: () => {
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

  getSortFieldsForJS: () => {
    return TaskController.getSortOptions()
      .filter(option => option.value) // Skip empty option
      .reduce((acc, option) => {
        acc[option.value] = { field: option.field, direction: option.direction };
        return acc;
      }, {});
  },

  getFilterConfig: () => {
    return {
      features: ['search', 'sort'],
      title: 'Wyszukiwanie i sortowanie',
      icon: 'bi bi-funnel',
      searchConfig: {
        placeholder: 'Wpisz nazwę zadania...',
        label: 'Szukaj zadań'
      },
      sortConfig: {
        label: 'Sortuj według',
        options: TaskController.getSortOptions()
      },
      showStatistics: true,
      containerClass: 'tasks-container',
      itemClass: 'col-md-6',
      searchFields: ['title'], // Search in .card-title content
      sortFields: TaskController.getSortFieldsForJS()
    };
  },

  getFormConfig: (type, req, task = null) => {
    const isEdit = type === 'edit';
    
    return {
      template: isEdit ? 'pages/task/task-edit' : 'pages/task/task-add',
      pageTitle: isEdit ? 'Edytuj zadanie' : 'Dodaj zadanie',
      pageName: 'tasks',
      formTitle: isEdit ? 'Edytuj zadanie' : 'Dodaj nowe zadanie',
      formAction: isEdit ? `/zadania/admin/${req.params?.id || task?._id}/edytuj` : '/zadania/admin/dodaj',
      submitText: isEdit ? 'Zaktualizuj zadanie' : 'Dodaj zadanie',
      task: task || req.body || {}
    };
  },

  // Routing functions
  getTasksPage: async (req, res) => {
    try {
      let q = req.query.q ? req.query.q : '';
      let sort = req.query.sort ? req.query.sort : '';

      let query = Task.find({taskName: { $regex: q, $options: 'i' }}) ?? null;
      if(sort) {
        const s = sort.split('|');
        const sortDirection = s[1] === 'desc' ? -1 : 1; // MongoDB needs -1 for desc, 1 for asc
        query = query.sort({ [s[0]]: sortDirection });
      }

      const tasks = await query.exec();

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
        query: req.query,
        filterConfig: TaskController.getFilterConfig()
      });
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  showAddTaskForm: async (req, res) => {
    try {
      const formConfig = TaskController.getFormConfig('add', req);
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
        isDone: false
      });

      await task.save();
      res.redirect('/zadania');
    } catch (error) {
      const formConfig = TaskController.getFormConfig('add', req);
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

      const formConfig = TaskController.getFormConfig('edit', req, task);
      await res.render(formConfig.template, formConfig);

    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  editTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { taskName, dateFrom, dateTo } = req.body;
      await Task.findByIdAndUpdate(id, {  
        taskName,  
        dateFrom,  
        dateTo: dateTo || null
      }, { runValidators: true });

      res.redirect('/zadania');
    } catch (error) {
        const task = await Task.findById(req.params.id);
        const formConfig = TaskController.getFormConfig('edit', req, task);
        ErrorController.handleValidationError(res, error, formConfig);
    }
  },

  toggleTaskStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      
      if (!task) {
        return res.status(404).json({ error: 'Zadanie nie znalezione' });
      }

      task.isDone = !task.isDone;
      await task.save();
      
      res.json({ success: true, isDone: task.isDone });
    } catch (error) {
      res.status(500).json({ error: 'Błąd podczas aktualizacji zadania' });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      await Task.findByIdAndDelete(id);
      res.redirect('/zadania');
        
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  }
};
  
module.exports = { TaskController }; 