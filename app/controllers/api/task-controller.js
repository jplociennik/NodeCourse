const { Task } = require('../../db/mongoose');
const { User } = require('../../db/mongoose');
const { ApiErrorController } = require('./error-controller');
const bcrypt = require('bcrypt');

const ApiTaskController = {
  
  // Get all tasks for current user
  getTasks: async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.user._id });
      res.json({ success: true, data: tasks, count: tasks.length });
    } catch (error) {
      ApiErrorController.handleError(res, error);
    }
  },

  // Get single task by ID
  getTask: async (req, res) => {
    try {
      const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
      if (!task) return ApiErrorController.handleNotFound(res, 'Task');   

      res.json({ success: true, data: task });
    } catch (error) {
      ApiErrorController.handleError(res, error);
    }
  },

  // Create new task
  createTask: async (req, res) => {
    try {
      const { taskName, dateFrom, dateTo } = req.body;
      const task = new Task({ taskName, dateFrom, dateTo, user: req.user._id });
      await task.save();

      res.status(201).json({ success: true, data: task, message: 'Task created successfully' });
    } catch (error) {
      ApiErrorController.handleError(res, error);
    }
  },

  // Update task
  updateTask: async (req, res) => {
    try {
      const { taskName, dateFrom, dateTo } = req.body;
      const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
      if (!task) return ApiErrorController.handleNotFound(res, 'Task');

      if (taskName !== undefined) task.taskName = taskName;
      if (dateFrom !== undefined) task.dateFrom = dateFrom;
      if (dateTo !== undefined) task.dateTo = dateTo;

      await task.save();

      res.json({ success: true, data: task, message: 'Task updated successfully' });
    } catch (error) {
      ApiErrorController.handleError(res, error);
    }
  },

  // Toggle task status
  toggleTask: async (req, res) => {
    try {
      const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

      if (!task) return ApiErrorController.handleNotFound(res, 'Task');

      task.isDone = !task.isDone;
      await task.save();

      res.json({  success: true, data: task, message: `Task ${task.isDone ? 'completed' : 'marked as pending'}` });
    } catch (error) {
      ApiErrorController.handleError(res, error);
    }
  },

  // Delete task
  deleteTask: async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

      if (!task) return ApiErrorController.handleNotFound(res, 'Task');

      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      ApiErrorController.handleError(res, error);
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return ApiErrorController.handleNotFound(res, 'Błędny email lub hasło');

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return ApiErrorController.handleForbidden(res, 'Błędny email lub hasło');

      res.json({ success: true, data: { token: user.apiToken } });
    } catch (error) {
      ApiErrorController.handleError(res, error);
    }
  }
};

module.exports = { ApiTaskController };
