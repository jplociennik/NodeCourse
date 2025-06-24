const { Task } = require('../db/mongoose');
const { ErrorController } = require('./error-controller');

const TaskController = {
  
  getFormConfig: (type, req, task = null) => {
    const isEdit = type === 'edit';
    
    return {
      template: isEdit ? 'Pages/task/task-edit' : 'Pages/task/task-add',
      pageTitle: isEdit ? 'Edytuj zadanie' : 'Dodaj zadanie',
      pageName: 'tasks',
      formTitle: isEdit ? 'Edytuj zadanie' : 'Dodaj nowe zadanie',
      formAction: isEdit ? `/zadania/admin/${req.params?.id || task?._id}/edytuj` : '/zadania/admin/dodaj',
      submitText: isEdit ? 'Zaktualizuj zadanie' : 'Dodaj zadanie',
      task: task || req.body || {}
    };
  },

  getTasksPage: async (_req, res) => {
    try {
      const tasks = await Task.find({}) ?? null;
      await res.render('Pages/task/tasks', { 
        pageTitle: 'Zadania',
        pageName: 'tasks',
        title: 'Lista zadań',
        subtitle: 'Przegląd aktualnych zadań',
        heroIcon: 'bi bi-list-check',
        sidebarTitle: 'Status zadań',
        sidebarContent: 'Tutaj znajdziesz informacje o postępie w realizacji zadań.',
        sidebarNews: {
          title: 'Aktualizacje',
          highlight: 'Nowe zadanie!',
          content: 'Właśnie dodano nowe zadanie do listy. Sprawdź szczegóły poniżej.'
        },
        tasks: tasks
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
        isDone: false // Nowe zadania są zawsze niewykonane
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
      // Pobierz zadanie ponownie dla formularza błędu
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