const { Task } = require('../db/mongoose');
const { User } = require('../db/mongoose');
const { ErrorController } = require('./error-controller');
const { removeTaskImage } = require('../services/image-service');
const { Parser } = require('json2csv');
const { sampleTasks } = require('../db/sample-tasks');

const TaskController = {
  
  // Private functions
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

  getSortFieldsConfig: async () => {
    return {
      'taskName': {
        selector: '.card-title',
        type: 'text',
        transform: (text) => text.toLowerCase()
      },
      'dateFrom': {
        selector: '.task-meta',
        type: 'date',
        regex: /\d{4}-\d{2}-\d{2}/,
        transform: (match) => match?.[0] ? new Date(match[0]) : new Date(0)
      },
      'isDone': {
        selector: 'input[type="checkbox"]',
        type: 'checkbox',
        transform: (checked) => checked ? 1 : 0
      }
    };
  },

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

  getFilterConfig: async () => {
    return {
      features: ['search', 'sort', 'advancedFilters', 'pagination'],
      title: 'Wyszukiwanie i sortowanie',
      icon: 'bi bi-funnel',
      searchConfig: {
        placeholder: 'Wpisz nazwę zadania...',
        label: 'Szukaj zadań'
      },
      sortConfig: {
        label: 'Sortuj według',
        options: await TaskController.getSortOptions()
      },
      filterConfig: {
        label: 'Filtry zaawansowane',
        options: await TaskController.getFilterOptions()
      },
      showStatistics: true,
      containerClass: 'tasks-container',
      itemClass: 'col-md-6',
      searchFields: ['title'], // Search in .card-title content
      sortFields: await TaskController.getSortFieldsConfig()
    };
  },

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
  },

  getCsvConfig: async (res, tasks) => {
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks.csv');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.attachment(`tasks-${Date.now()}.csv`);

    const mapTaskForCsv = task => ({
      taskName: task.taskName,
      dateFrom: task.dateFrom ? new Date(task.dateFrom).toLocaleDateString('pl-PL') : '',
      dateTo: task.dateTo ? new Date(task.dateTo).toLocaleDateString('pl-PL') : '',
      isDone: task.isDone ? 'Wykonane' : 'Do wykonania'
    });
    const data = tasks.map(mapTaskForCsv);

    const fields = [
      { label: 'Nazwa zadania', value: 'taskName' },
      { label: 'Data od', value: 'dateFrom' },
      { label: 'Data do', value: 'dateTo' },
      { label: 'Status', value: 'isDone' }
    ];

    return { fields, data, res };
  },

  // Routing functions
  getTasksPage: async (req, res) => {
    try {
        let q = req.query.q ? req.query.q : '';
        let sort = req.query.sort ? req.query.sort : '';
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        // Filtering
        const where = {};
        where.user = req.session.userId;
        if (q) { where.taskName = { $regex: q, $options: 'i' }; }
        if (req.query.dateFrom) { where.dateFrom = { $gte: req.query.dateFrom }; } 
        if (req.query.dateTo) { where.$or = [ { dateTo: { $lte: req.query.dateTo } }, { dateTo: null, dateFrom: { $lte: req.query.dateTo } } ]; }
        
        // Handle status filters
        if (req.query.done === 'on') where.isDone = true;
        if (req.query.todo === 'on') where.isDone = false;

        // Get total count for pagination
        const totalCount = await Task.countDocuments(where);
        const pagesCount = Math.ceil(totalCount / limit);

        // Query with pagination
        let query = Task.find(where);
        query = query.skip((page - 1) * limit).limit(limit);

        // Sorting
        if(sort) {
            const s = sort.split('|');
            const sortDirection = s[1] === 'desc' ? -1 : 1;
            query = query.sort({ [s[0]]: sortDirection });
        }

        const tasks = await query.exec();

        // Sprawdź czy użytkownik już wygenerował przykładowe zadania
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
            query: req.query,
            hasGeneratedSampleTasks: hasGeneratedSampleTasks,
            paginationConfig: {
                page,
                pagesCount,
                resultsCount: totalCount,
                limit
            },
            filterConfig: await TaskController.getFilterConfig(),
            statisticsConfig: {
                show: tasks.length > 0,
                title: 'Statystyki zadań',
                items: [
                    {
                        id: 'todoCount',
                        value: tasks.filter(t => !t.isDone).length,
                        label: 'Do zrobienia'
                    },
                    {
                        id: 'doneCount', 
                        value: tasks.filter(t => t.isDone).length,
                        label: 'Wykonane'
                    }
                ]
            }
        });
    } catch (error) {
        ErrorController.handleError(res, error);
    }
  },

  showAddTaskForm: async (req, res) => {
    try {
      const formConfig = await TaskController.getFormConfig('add', req);
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
      const formConfig = await TaskController.getFormConfig('add', req);
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

      const formConfig = await TaskController.getFormConfig('edit', req, task);
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
        image: req.file?.filename ?? task.image
      }, { runValidators: true });

      res.redirect('/zadania/user');
    } catch (error) {
        const task = await Task.findById(req.params.id);
        const formConfig = await TaskController.getFormConfig('edit', req, task);
        ErrorController.handleValidationError(res, error, formConfig);
    }
  },

  toggleTaskStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);

      task.isDone = !task.isDone;
      await task.save();
      
      res.json({ success: true, isDone: task.isDone });
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
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

  exportTasks: async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.session.userId });
      const csvConfig = await TaskController.getCsvConfig(res, tasks);
      const parser = new Parser({ fields: csvConfig.fields });
      const csv = parser.parse(csvConfig.data);
      const bom = '\uFEFF';
      res.send(bom + csv);
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  exportAllTasks: async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.session.userId });
      const csvConfig = await TaskController.getCsvConfig(res, tasks);
      const parser = new Parser({ fields: csvConfig.fields });
      const csv = parser.parse(csvConfig.data);
      const bom = '\uFEFF';
      res.send(bom + csv);
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  generateSampleTasks: async (req, res) => {
    try {
      // Sprawdź czy użytkownik istnieje
      const user = await User.findById(req.session.userId);
      if (!user) {
        return ErrorController.handleServerError(res, new Error('Użytkownik nie został znaleziony'), 'Użytkownik nie został znaleziony');
      }
      if (user.hasGeneratedSampleTasks) {
        req.flash('error', 'Przykładowe zadania zostały już wygenerowane dla tego użytkownika');
        return res.redirect('/zadania/user');
      }

      const tasksToInsert = sampleTasks.map(task => ({ ...task, user: req.session.userId }));
      await Task.insertMany(tasksToInsert);
      user.hasGeneratedSampleTasks = true;
      await user.save();

      req.flash('success', 'Pomyślnie wygenerowano 20 przykładowych zadań!');
      res.redirect('/zadania/user');
    } catch (error) {
      console.error('Błąd podczas generowania przykładowych zadań:', error);
      return ErrorController.handleServerError(res, error, 'Wystąpił błąd podczas generowania przykładowych zadań');
    }
  },
};
  
module.exports = { TaskController }; 