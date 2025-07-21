const express = require('express');
const { ApiTaskController } = require('../controllers/api/task-controller');
const { apiAuthMiddleware } = require('../middleware/auth-middleware');

const apiRouter = express.Router();

// Task routes
apiRouter.post('/login', ApiTaskController.login);
apiRouter.get('/tasks', apiAuthMiddleware.requireAuth, ApiTaskController.getTasks);
apiRouter.get('/tasks/:id', apiAuthMiddleware.requireAuth, ApiTaskController.getTask);
apiRouter.post('/tasks/create', apiAuthMiddleware.requireAuth, ApiTaskController.createTask);
apiRouter.put('/tasks/update/:id', apiAuthMiddleware.requireAuth, ApiTaskController.updateTask);
apiRouter.patch('/tasks/toggle/:id', apiAuthMiddleware.requireAuth, ApiTaskController.toggleTask);
apiRouter.delete('/tasks/delete/:id', apiAuthMiddleware.requireAuth, ApiTaskController.deleteTask);

module.exports = apiRouter;