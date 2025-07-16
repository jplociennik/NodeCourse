const flashMiddleware = (req, res, next) => {
    req.flash = (type, message) => {
        if (!req.session.flash) {
            req.session.flash = {};
        }
        req.session.flash[type] = message;
    };
    
    res.locals.messages = {};
    if (req.session.flash) {
        res.locals.messages = req.session.flash;
        delete req.session.flash;
    }
    
    next();
};

module.exports = { flashMiddleware }; 