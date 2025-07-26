const { User } = require('../../db/mongoose.js');
const { ErrorController } = require('../error-controller.js');
const { UserControllerConfig } = require('./user-controller-config.js');
const UserFilterService = require('./user-filter.js');

/**
 * Renders edit profile form with user data and errors
 * @param {Object} res - Express response object
 * @param {Object} user - User object
 * @param {Object} errors - Validation errors object
 * @param {Object} formData - Form data object
 */
async function renderEditProfileForm(res, user, errors = {}, formData = {}) {
  await res.render('pages/profile/profile-edit', {
    pageTitle: 'Edytuj profil',
    pageName: 'profile',
    title: 'Edytuj profil',
    user,
    errors,
    formData
  });
}

const UserController = {
  /**
   * Gets users list with filtering and sorting
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getUsersList: async (req, res) => {
    try {
      // Get filtered users using the service
      const { users, statisticsConfig } = await UserFilterService.getFilteredUsers(req.query);

      await res.render('pages/profile/profile-list', {
        pageTitle: 'Profile użytkowników',
        pageName: 'profile',
        title: 'Profile użytkowników',
        subtitle: 'Lista wszystkich zarejestrowanych użytkowników',
        heroIcon: 'bi bi-people-fill',
        breadcrumbs: [
          {
            text: 'Profile',
            icon: 'bi bi-people'
          }
        ],
        users: users,
        query: req.query,
        mainFilterConfig: UserControllerConfig.getMainFilterConfig(),
        statisticsConfig: statisticsConfig
      });
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  /**
   * Gets single user profile by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getUserProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        ErrorController.handleUserNotFound(res, id);
      } else {
        await res.render('pages/profile/profile-single', {
          pageTitle: `Profil - ${user.name}`,
          pageName: 'profile',
          title: `Profil użytkownika`,
          subtitle: user.name,
          heroIcon: 'bi bi-person-fill',
          breadcrumbs: [
            {
              text: 'Profile',
              link: '/profile',
              icon: 'bi bi-people'
            },
            {
              text: user.name,
              icon: 'bi bi-person'
            }
          ],
          user: user
        });
      }
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  /**
   * Gets detailed user information by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getUserDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        ErrorController.handleUserNotFound(res, id);
      } else {
        // Sprawdź czy to własny profil
        const isOwnProfile = req.session.userId && req.session.userId.toString() === id;
        
        await res.render('pages/profile/profile-details', {
          pageTitle: `Szczegóły - ${user.name}`,
          pageName: 'profile',
          title: `Szczegóły użytkownika`,
          subtitle: user.name,
          heroIcon: 'bi bi-person-lines-fill',
          breadcrumbs: [
            {
              text: 'Profile',
              link: '/profile',
              icon: 'bi bi-people'
            },
            {
              text: user.name,
              link: `/profile/${user.id}`,
              icon: 'bi bi-person'
            },
            {
              text: 'Szczegóły',
              icon: 'bi bi-info-circle'
            }
          ],
          user: user,
          isOwnProfile: isOwnProfile
        });
      }
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  /**
   * Shows edit profile form for current user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  showEditProfile: async (req, res) => {
    try {
      const user = await User.findById(req.session.userId);  
      await renderEditProfileForm(res, user);
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  /**
   * Updates current user profile
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateProfile: async (req, res) => {
    try {
      const user = await User.findById(req.session.userId);
      const { name, password } = req.body;
      user.name = name;
      
      if (req.body.password) user.password = password;
      await user.save();

      req.flash('success', 'Profil został zaktualizowany.');
      res.redirect('/user/profil');

    } catch (error) {
      await renderEditProfileForm(res, req.session, error.errors || {}, req.body);
    }
  },
};

module.exports = { UserController };
