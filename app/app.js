require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const expressEjsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const rateLimiterMiddleware = require('./middleware/rate-limiter-middleware');
const path = require('path');
const router = require('./routes/web');
const { viewMiddleware } = require('./middleware/view-middleware');
const { flashMiddleware } = require('./middleware/flash-middleware');
const { authMiddleware } = require('./middleware/auth-middleware');
const { sessionKeySecret } = require('./config')
const helmet = require('helmet')

const app = express();

//View Engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, '../views'));

//Layouts
app.use(expressEjsLayouts);
app.set('layout', './layouts/main');

//Static Files
app.use(express.static(path.join(__dirname, '../public')));

//Parsers
app.use(express.json());
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
app.use(flashMiddleware);

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

process.on('warning', (warning) => {
    console.log(warning.stack);
});

//Middleware
app.use('/', viewMiddleware);
app.use('/', authMiddleware.addUserToLocals);
app.use(/.*\/user(\/|$)/, authMiddleware.requireAuth);
app.use(rateLimiterMiddleware);
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "https://cdn.jsdelivr.net"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
        }
    }
}));

//Router
app.use('/', router);

module.exports = app;