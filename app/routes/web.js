const express = require('express');
const { notFoundMiddleware } = require('../middleware/error-middleware');
const { HomeController } = require('../controllers/home-controller');
const { UserController } = require('../controllers/user-controller');
const { AuthController } = require('../controllers/auth-controller');
const { TaskController } = require('../controllers/task-controller');
const { authMiddleware } = require('../middleware/auth-middleware');
const { createImageUpload, IsWrongImageMimeType } = require('../services/image-service');

const upload = createImageUpload();
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
router.get('/user/profil', AuthController.showProfile);
router.get('/user/profil/edytuj', UserController.showEditProfile);
router.post('/user/profil/edytuj', UserController.updateProfile);

// Pozostałe ścieżki
router.get('/profile', UserController.getUsersList);
router.get('/profile/:id', UserController.getUserProfile);
router.get('/profile/:id/szczegoly', UserController.getUserDetails);

// Routes dla zadań (tylko dla zalogowanych)
router.get('/zadania/user/',  TaskController.getTasksPage);
router.get('/zadania/user/dodaj', TaskController.showAddTaskForm);

// Dodawanie zadania z obsługą błędu typu pliku
router.post('/zadania/user/dodaj', 
  upload.single('image'),
  IsWrongImageMimeType,
  TaskController.addTask
);
router.get('/zadania/user/:id/edytuj', 
    upload.single('image'), 
    TaskController.showEditTaskForm);

// Edycja zadania z obsługą błędu typu pliku
router.post('/zadania/user/:id/edytuj', 
  authMiddleware.requireAuth,
  upload.single('image'),
  IsWrongImageMimeType,
  TaskController.editTask
);
router.post('/zadania/user/:id/toggle',  TaskController.toggleTaskStatus);
router.post('/zadania/user/:id/usun',  TaskController.deleteTask);
router.post('/zadania/user/:id/usun-zdjecie', TaskController.deleteImage);

// Csv export
router.get('/zadania/user/export', TaskController.exportTasks);
router.get('/zadania/user/export/all', TaskController.exportAllTasks);

// Middleware dla 404 - musi być na końcu
router.use(notFoundMiddleware);

module.exports = router;