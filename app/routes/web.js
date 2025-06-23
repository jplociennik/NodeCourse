const express = require('express');
const { HomeController } = require('../controllers/home-controller');
const { UserController } = require('../controllers/user-controller');
const { ErrorController } = require('../controllers/error-controller');

const router = express.Router();

// Główne routes
router.get('/', HomeController.getHomePage);
router.get('/home', HomeController.getHomePage);
router.get('/contact', HomeController.getContactPage);

// Routes dla użytkowników
router.get('/profile', UserController.getUsersList);
router.get('/profile/:id', UserController.getUserProfile);
router.get('/profile/:id/details', UserController.getUserDetails);

// Middleware dla 404 - musi być na końcu
router.use(ErrorController.notFoundMiddleware);

module.exports = { router };