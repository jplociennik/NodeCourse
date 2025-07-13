const { User } = require('../db/mongoose');
const { ErrorController } = require('./error-controller');

async function renderEditProfileForm(res, user, errors = {}, formData = {}) {
  await res.render('Pages/profile/profile-edit', {
    pageTitle: 'Edytuj profil',
    pageName: 'profile',
    title: 'Edytuj profil',
    user,
    errors,
    formData
  });
}

const UserController = {
  getSortOptions: async () => {
    return [
      { value: '', text: 'Domyślne', field: null, direction: null },
      { value: 'name|asc', text: 'Nazwa A-Z', field: 'data-name', direction: 'asc' },
      { value: 'name|desc', text: 'Nazwa Z-A', field: 'data-name', direction: 'desc' },
      { value: 'createdAt|asc', text: 'Najstarsze', field: 'data-created', direction: 'asc' },
      { value: 'createdAt|desc', text: 'Najnowsze', field: 'data-created', direction: 'desc' }
    ];
  },

  getSortFieldsConfig: async () => {
    return {
      'name': {
        selector: '[data-name]',
        type: 'text',
        attribute: 'data-name',
        transform: (text) => text.toLowerCase()
      },
      'createdAt': {
        selector: '[data-created]',
        type: 'text',
        attribute: 'data-created',
        transform: (text) => new Date(text)
      }
    };
  },

  getFilterOptions: async () => {
    return [
      {
        id: 'role',
        label: 'Rola użytkownika',
        type: 'checkbox-group',
        options: [
          { value: 'admin', label: 'Administratorzy', field: 'isAdmin', filterValue: true },
          { value: 'user', label: 'Zwykli użytkownicy', field: 'isAdmin', filterValue: false }
        ]
      },
      {
        id: 'createdFrom',
        label: 'Dołączył od',
        type: 'date',
        field: 'createdAt',
        placeholder: 'Wybierz datę od'
      },
      {
        id: 'createdTo',
        label: 'Dołączył do', 
        type: 'date',
        field: 'createdAt',
        placeholder: 'Wybierz datę do'
      }
    ];
  },

  getFilterConfig: async () => {
    return {
      features: ['search', 'sort','advancedFilters'],
      title: 'Wyszukiwanie i sortowanie',
      icon: 'bi bi-funnel',
      searchConfig: {
        placeholder: 'Wpisz nazwę użytkownika...',
        label: 'Szukaj użytkowników'
      },
      sortConfig: {
        label: 'Sortuj według',
        options: await UserController.getSortOptions()
      },
      filterConfig: {
        label: 'Filtry zaawansowane',
        options: await UserController.getFilterOptions()
      },
      showStatistics: false,
      containerClass: 'profiles-container',
      itemClass: 'profile-item',
      searchFields: ['data-name'], // Search in data-name attribute
      sortFields: await UserController.getSortFieldsConfig()
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
        filterConfig: await UserController.getFilterConfig(),
        statisticsConfig: {
          show: users.length > 0,
          title: 'Statystyki użytkowników',
          items: [
            {
              id: 'totalCount',
              value: users.length,
              label: 'Wszystkich'
            },
            {
              id: 'visibleCount',
              value: users.length,
              label: 'Widocznych'
            }
          ]
        }
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
  },

  showEditProfile: async (req, res) => {
    try {
      const user = await User.findById(req.session.userId);  
      await renderEditProfileForm(res, user);
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

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
