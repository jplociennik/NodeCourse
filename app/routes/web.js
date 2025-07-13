const express = require('express');
const { notFoundMiddleware } = require('../middleware/error-middleware');
const { HomeController } = require('../controllers/home-controller');
const { UserController } = require('../controllers/user-controller');
const { AuthController } = require('../controllers/auth-controller');
const { TaskController } = require('../controllers/task-controller');
const { authMiddleware } = require('../middleware/auth-middleware');

const router = express.Router();

// Główne routes
router.get('/', HomeController.getHomePage);
router.get('/home', HomeController.getHomePage);
router.get('/kontakt', HomeController.getContactPage);
router.get('/o-nas', HomeController.getAboutPage);

// Ścieżki autoryzacji (tylko dla niezalogowanych)
router.get('/zarejestruj', authMiddleware.requireGuest, AuthController.showRegisterForm);
router.post('/zarejestruj', authMiddleware.requireGuest, AuthController.register);
router.get('/zaloguj', authMiddleware.requireGuest, AuthController.showLoginForm);
router.post('/zaloguj', authMiddleware.requireGuest, AuthController.login);
router.get('/wyloguj', AuthController.logout);

// Osobisty profil (tylko dla zalogowanych)
router.get('/admin/profil', AuthController.showProfile);
router.get('/admin/profil/edytuj', UserController.showEditProfile);
router.post('/admin/profil/edytuj', UserController.updateProfile);

// Pozostałe ścieżki
router.get('/profile', UserController.getUsersList);
router.get('/profile/:id', UserController.getUserProfile);
router.get('/profile/:id/szczegoly', UserController.getUserDetails);

// Routes dla zadań (tylko dla zalogowanych)
router.get('/zadania', TaskController.getTasksPage);
router.get('/zadania/admin/dodaj', TaskController.showAddTaskForm);
router.post('/zadania/admin/dodaj', TaskController.addTask);
router.get('/zadania/admin/:id/edytuj', TaskController.showEditTaskForm);
router.post('/zadania/admin/:id/edytuj', TaskController.editTask);
router.post('/zadania/admin/:id/toggle', TaskController.toggleTaskStatus);
router.post('/zadania/admin/:id/usun', TaskController.deleteTask);

// Middleware dla 404 - musi być na końcu
router.use(notFoundMiddleware);

module.exports = router;