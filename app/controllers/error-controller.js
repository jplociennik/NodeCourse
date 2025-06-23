const ErrorController = {
  handleError: (res, error) => {
    console.error('Database error:', error);
    res.status(500).render('errors/500', {
      pageTitle: 'Błąd serwera',
      pageName: 'error',
      currentPage: 'error',
      error: error.message,
      title: 'Błąd serwera',
      subtitle: 'Wystąpił problem z bazą danych',
      heroIcon: 'bi bi-exclamation-triangle-fill'
    });
  },

  handleServerError: (res, error, message = 'Wystąpił błąd serwera') => {
    console.error('Server error:', error);
    res.status(500).render('errors/500', {
      pageTitle: 'Błąd serwera',
      pageName: 'error',
      currentPage: 'error',
      error: message,
      title: 'Błąd serwera',
      subtitle: message,
      heroIcon: 'bi bi-exclamation-triangle-fill'
    });
  },

  handle404Error: (res, path) => {
    res.status(404).render('errors/404', {
      pageTitle: 'Strona nie znaleziona',
      pageName: 'error',
      currentPage: 'error',
      path: path,
      title: 'Strona nie znaleziona',
      subtitle: `Nie można znaleźć strony: ${path}`,
      heroIcon: 'bi bi-question-circle-fill'
    });
  },

  handleUserNotFound: (res, userId) => {
    res.status(404).render('errors/user-not-found', {
      pageTitle: 'Użytkownik nie znaleziony',
      pageName: 'error',
      currentPage: 'error',
      userId: userId,
      title: 'Użytkownik nie znaleziony',
      subtitle: `Nie można znaleźć użytkownika o ID: ${userId}`,
      heroIcon: 'bi bi-person-x-fill',
      breadcrumbs: [
        {
          text: 'Profile',
          link: '/profile',
          icon: 'bi bi-people'
        },
        {
          text: 'Błąd',
          icon: 'bi bi-exclamation-triangle'
        }
      ]
    });
  },

  notFoundMiddleware: (req, res) => {
    ErrorController.handle404Error(res, req.originalUrl);
  }
};

module.exports = { ErrorController }; 