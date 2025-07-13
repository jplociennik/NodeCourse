require('mongoose');
const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const app = express();
const router = require('./routes/web');
const { viewMiddleware } = require('./middleware/view-middleware');
const { authMiddleware } = require('./middleware/auth-middleware');
const cookieParser = require('cookie-parser');
const { sessionKeySecret } = require('./config')

//View Engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, '/../views'));

//Layouts
app.use(expressEjsLayouts);
app.set('layout', './layouts/main');

//Static Files
app.use(express.static(path.join(__dirname, '../public')));

//Parsers
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Session Configuration
app.use(session({
    secret: sessionKeySecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

//Flash Messages
app.use(flash());

//Content Security Policy Headers
app.use((_req, res, next) => {
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
    
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
});

//Middleware
app.use('/', viewMiddleware);
app.use('/', authMiddleware.addUserToLocals);
app.use('admin/', authMiddleware.requireAuth);

//Router
app.use('/', router);

module.exports = app;