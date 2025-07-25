const ErrorController = {
  /**
   * Handles general server errors
   * @param {Object} res - Express response object
   * @param {Error} error - Error object
   */
  handleError: async (res, error) => {
    console.log(error.message);

    await res.status(500).render('errors/500', {
      pageTitle: 'Błąd serwera',
      pageName: 'error',
      error: error.message,
      title: 'Błąd serwera',  
      subtitle: 'Wystąpił problem z bazą danych',
      heroIcon: 'bi bi-exclamation-triangle-fill'
    });
  },

  /**
   * Handles validation errors for forms
   * @param {Object} res - Express response object
   * @param {Error} error - Error object
   * @param {Object} formConfig - Form configuration object
   */
  handleValidationError: async (res, error, formConfig) => {
      if (error.name === 'ValidationError' || error.name === 'MongoServerError') {
        return res.render(formConfig.template, {
          ...formConfig,
          errors: {
            email: {
              message: error.message
            }
          },
          formData: formConfig.formData || {}
        });
      }
    
    return ErrorController.handleError(res, error);
  },

  /**
   * Handles server errors with custom message
   * @param {Object} res - Express response object
   * @param {Error} error - Error object
   * @param {string} message - Custom error message
   */
  handleServerError: async (res, error, message = 'Wystąpił błąd serwera') => {
    await res.status(500).render('errors/500', {
      pageTitle: 'Błąd serwera',
      pageName: 'error',
      error: message,
      title: 'Błąd serwera',
      subtitle: message,
      heroIcon: 'bi bi-exclamation-triangle-fill'
    });
  },

  /**
   * Handles 404 not found errors
   * @param {Object} res - Express response object
   * @param {string} path - Requested path that was not found
   */
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

  /**
   * Handles user not found errors
   * @param {Object} res - Express response object
   * @param {string} userId - User ID that was not found
   */
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