require('mongoose');
const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();
const { router } = require('./routes/web');

//View Engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, '/../views'));

//Layouts
app.use(expressEjsLayouts);
app.set('layout', './layouts/main');

//Static Files
app.use(express.static(path.join(__dirname, '../public')));

//Router
app.use(router);

module.exports = app;