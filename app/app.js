require('mongoose');
const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();
const { router } = require('./routes/web');
const { viewMiddleware } = require('./middleware/view-middleware');

//View Engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, '/../views'));

//Layouts
app.use(expressEjsLayouts);
app.set('layout', './layouts/main');

//Static Files
app.use(express.static(path.join(__dirname, '../public')));

//Body Parser
app.use(express.urlencoded({ extended: true }));

//Middleware
app.use('/', viewMiddleware);

//Router
app.use(router);

module.exports = app;