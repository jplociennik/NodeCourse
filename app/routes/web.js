const express = require('express');
const { HomeController } = require('../controllers/home-controller');
const { UserController } = require('../controllers/user-controller');
const { notFoundMiddleware } = require('../middleware/error-middleware');
const { TaskController } = require('../controllers/task-controller');

const router = express.Router();

// Główne routes
router.get('/', HomeController.getHomePage);
router.get('/home', HomeController.getHomePage);
router.get('/kontakt', HomeController.getContactPage);
router.get('/o-nas', HomeController.getAboutPage);

// Routes dla użytkowników
router.get('/profile', UserController.getUsersList);
router.get('/profile/:id', UserController.getUserProfile);
router.get('/profile/:id/szczegoly', UserController.getUserDetails);

// Routes dla zadań
router.get('/zadania', TaskController.getTasksPage);
router.get('/zadania/admin/dodaj', TaskController.showAddTaskForm);
router.post('/zadania/admin/dodaj', TaskController.addTask);
router.get('/zadania/admin/:id/edytuj', TaskController.showEditTaskForm);
router.post('/zadania/admin/:id/edytuj', TaskController.editTask);
router.post('/zadania/admin/:id/toggle', TaskController.toggleTaskStatus);
router.get('/zadania/admin/:id/usun', TaskController.deleteTask);

// Middleware dla 404 - musi być na końcu
router.use(notFoundMiddleware);

module.exports = { router };