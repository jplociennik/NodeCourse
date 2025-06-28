const { User } = require('../db/mongoose');
const { ErrorController } = require('./error-controller');

const UserController = {
  getSortOptions: () => {
    return [
      { value: '', text: 'Domyślne', field: null, direction: null },
      { value: 'name|asc', text: 'Nazwa A-Z', field: 'name', direction: 'asc' },
      { value: 'name|desc', text: 'Nazwa Z-A', field: 'name', direction: 'desc' },
      { value: 'createdAt|asc', text: 'Najstarsze', field: 'created', direction: 'asc' },
      { value: 'createdAt|desc', text: 'Najnowsze', field: 'created', direction: 'desc' }
    ];
  },

  getSortFieldsForJS: () => {
    return UserController.getSortOptions()
      .filter(option => option.value) // Skip empty option
      .reduce((acc, option) => {
        acc[option.value] = { field: option.field, direction: option.direction };
        return acc;
      }, {});
  },

  getFilterConfig: () => {
    return {
      features: ['search', 'sort'],
      title: 'Wyszukiwanie i sortowanie',
      icon: 'bi bi-funnel',
      searchConfig: {
        placeholder: 'Wpisz nazwę użytkownika...',
        label: 'Szukaj użytkowników'
      },
      sortConfig: {
        label: 'Sortuj według',
        options: UserController.getSortOptions()
      },
      showStatistics: false,
      containerClass: 'profiles-container',
      itemClass: 'profile-item',
      searchFields: ['data-name'], // Search in data-name attribute
      sortFields: UserController.getSortFieldsForJS()
    };
  },

  getUsersList: async (req, res) => {
    try {
      let q = req.query.q ? req.query.q.trim() : '';
      let sort = req.query.sort ? req.query.sort : '';

      let query = User.find({name: { $regex: q, $options: 'i' }}) ?? null;
      if(sort) {
        const s = sort.split('|');
        const sortDirection = s[1] === 'desc' ? -1 : 1; // MongoDB needs -1 for desc, 1 for asc
        query = query.sort({ [s[0]]: sortDirection });
      }

      const users = await query.exec();

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
        filterConfig: UserController.getFilterConfig()
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

  getUserDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        ErrorController.handleUserNotFound(res, id);
      } else {
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
          user: user
        });
      }
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  }
};

module.exports = { UserController };
