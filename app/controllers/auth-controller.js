const { User } = require('../db/mongoose');
const { ErrorController } = require('./error-controller');
const { verifyPassword } = require('../db/extensions');
const { createValidationError } = require('../errors');

const AuthController = {
    getRegisterFormConfig: async (req) => {
        return {
            template: 'Pages/auth/register',
            pageTitle: 'Rejestracja',
            pageName: 'register',
            title: 'Rejestracja',
            subtitle: 'Dołącz do nas!',
            heroIcon: 'bi bi-person-plus-fill',
            formAction: '/zarejestruj',
            submitText: 'Zarejestruj się',
            formData: req.body || {},
            breadcrumbs: [
                {
                  text: 'Zarejestruj',
                  icon: 'bi bi-person-add'
                }
            ],
        };
    },

    getLoginFormConfig: async (req) => {
        return {
            template: 'Pages/auth/login',
            pageTitle: 'Logowanie',
            pageName: 'login',
            title: 'Logowanie',
            subtitle: 'Zaloguj się do swojego konta',
            heroIcon: 'bi bi-box-arrow-in-right',
            formAction: '/zaloguj',
            submitText: 'Zaloguj się',
            formData: req.body || {}
        };
    },

    showRegisterForm: async (req, res) => {
        const formConfig = await AuthController.getRegisterFormConfig(req);
        await res.render(formConfig.template, formConfig);
    },

    register: async (req, res) => {
        try {
            const { email, username, password, confirmPassword } = req.body;

            if (password !== confirmPassword) {
                req.flash('error', 'Hasła nie są identyczne');
            }

            const newUser = new User({
                name: username,
                email: email,
                password: password
            });

            await newUser.save();

            req.flash('success', 'Konto zostało utworzone. Możesz się teraz zalogować.');
            res.redirect('/zaloguj');

            } catch (error) {
                
                const formConfig = await AuthController.getRegisterFormConfig(req);
                return ErrorController.handleValidationError(res, error, formConfig);
            }
    },

    showLoginForm: async (req, res) => {
        const formConfig = await AuthController.getLoginFormConfig(req);
        await res.render(formConfig.template, formConfig);
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            
            if (!user)
                throw createValidationError('Nieprawidłowy email lub hasło'); 
            if (!(await user.comparePassword(password)))
                throw createValidationError('Nieprawidłowy email lub hasło');

            req.session.userId = user._id;
            req.session.userEmail = user.email;
            req.session.userName = user.name;

            req.flash('success', 'Zostałeś pomyślnie zalogowany');
            res.redirect('/');

        } catch (error) {
            console.error('Błąd logowania:', error);
            const formConfig = await AuthController.getLoginFormConfig(req);
            return ErrorController.handleValidationError(res, error, formConfig);
        }
    },

    logout: async (req, res) => {
        req.session.destroy((err) => {
            if (err) console.error('Błąd podczas wylogowywania:', err);
            res.redirect('/');
        });
    },

    showProfile: async (req, res) => {
        try {
            const user = await User.findById(req.session.userId);
            
            if (!user) {
                req.flash('error', 'Użytkownik nie został znaleziony');
                return res.redirect('/');
            }

            await res.render('Pages/profile/profile-details', {
                pageTitle: 'Mój profil',
                pageName: 'profile',
                title: 'Mój profil',
                subtitle: 'Twoje dane osobowe',
                heroIcon: 'bi bi-person-circle',
                user: user,
                breadcrumbs: [
                    {
                        text: 'Profil',
                        icon: 'bi bi-person'
                    }
                ]
            });
        } catch (error) {
            console.error('Błąd podczas ładowania profilu:', error);
            req.flash('error', 'Wystąpił błąd podczas ładowania profilu');
            res.redirect('/');
        }
    }
};

module.exports = { AuthController }; 