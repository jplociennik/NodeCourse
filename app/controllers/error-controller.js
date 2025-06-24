const ErrorController = {
  handleError: async (res, error) => {
    console.error('Database error:', error);
    await res.status(500).render('errors/500', {
      pageTitle: 'Błąd serwera',
      pageName: 'error',
      error: error.message,
      title: 'Błąd serwera',
      subtitle: 'Wystąpił problem z bazą danych',
      heroIcon: 'bi bi-exclamation-triangle-fill'
    });
  },

  handleValidationError: async (res, error, formConfig) => {
    // Jeśli to błąd walidacji Mongoose, przekaż błędy do formularza
    if (error.name === 'ValidationError') {
      return res.render(formConfig.template, {
        pageTitle: formConfig.pageTitle,
        pageName: formConfig.pageName,
        formTitle: formConfig.formTitle,
        formAction: formConfig.formAction,
        submitText: formConfig.submitText,
        task: formConfig.task,
        errors: error.errors
      });
    }
    
    // Jeśli to nie błąd walidacji, użyj standardowej obsługi błędów
    return ErrorController.handleError(res, error);
  },

  handleServerError: async (res, error, message = 'Wystąpił błąd serwera') => {
    console.error('Server error:', error);
    await res.status(500).render('errors/500', {
      pageTitle: 'Błąd serwera',
      pageName: 'error',
      error: message,
      title: 'Błąd serwera',
      subtitle: message,
      heroIcon: 'bi bi-exclamation-triangle-fill'
    });
  },

  handle404Error: async (res, path) => {
    await res.status(404).render('errors/404', {
      pageTitle: 'Strona nie znaleziona',
      pageName: 'error',
      path: path,
      title: 'Strona nie znaleziona',
      subtitle: `Nie można znaleźć strony: ${path}`,
      heroIcon: 'bi bi-question-circle-fill'
    });
  },

  handleUserNotFound: async (res, userId) => {
    await res.status(404).render('errors/user-not-found', {
      pageTitle: 'Użytkownik nie znaleziony',
      pageName: 'error',
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
  }
};

module.exports = { ErrorController }; 