const { User } = require('../db/mongoose');
const { ErrorController } = require('./error-controller');

const UserController = {
  getUsersList: async (_req, res) => {
    try {
      const users = await User.find({});
      await res.render('Pages/profile/profile-list', {
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
        users: users
      });
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  getUserProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        ErrorController.handleUserNotFound(res, id);
      } else {
        await res.render('Pages/profile/profile-single', {
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

  getUserDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        ErrorController.handleUserNotFound(res, id);
      } else {
        await res.render('Pages/profile/profile-details', {
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
          user: user
        });
      }
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  }
};

module.exports = { UserController };
