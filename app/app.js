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

//Content Security Policy Headers
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
        "font-src 'self' https://cdn.jsdelivr.net; " +
        "img-src 'self' data: https:; " +
        "form-action 'self'; " +
        "frame-ancestors 'none'; " +
        "connect-src 'self';"
    );
    
    // Additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
});

//Middleware
app.use('/', viewMiddleware);

//Router
app.use(router);

module.exports = app;