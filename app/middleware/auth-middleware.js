const { User } = require('../db/mongoose');
const { ApiErrorController } = require('../controllers/api/error-controller');

const authMiddleware = {
    // Middleware do sprawdzania czy użytkownik jest zalogowany
    requireAuth: (req, res, next) => {
        if (!req.session.userId) {
            req.flash('error', 'Musisz być zalogowany, aby uzyskać dostęp do tej strony');
            return res.redirect('/zaloguj');
        }
        next();
    },

    // Middleware do dodawania informacji o użytkowniku do wszystkich widoków
    addUserToLocals: async (req, res, next) => {
        try {
            res.locals.isLoggedIn = !!req.session.userId;
            res.locals.user = null;

            if (req.session.userId) {
                const user = await User.findById(req.session.userId).select('name email');
                if (user) {
                    res.locals.user = {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    };
                } else 
                    req.session.destroy();             
            }

            next();
        } catch (error) {
            console.error('Błąd w auth middleware:', error);
            next();
        }
    },

    // Middleware do sprawdzania czy użytkownik NIE jest zalogowany (dla stron logowania/rejestracji)
    requireGuest: (req, res, next) => {
        if (req.session.userId) {
            req.flash('info', 'Jesteś już zalogowany');
            return res.redirect('/');
        }
        next();
    }
};

const apiAuthMiddleware = {     
    requireAuth: async (req, res, next) => {

        const apiToken = req.headers.authorization.split(' ')[1];
        const user = await User.findOne({ apiToken: apiToken });
        
        if (!user) {
            return ApiErrorController.handleUnauthorized(res, 'Nie masz dostępu do tej strony. Zaloguj się.');
        }
        req.user = user;
        next();
    }
};

module.exports = { authMiddleware, apiAuthMiddleware }; 