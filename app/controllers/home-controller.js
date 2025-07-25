const { ErrorController } = require('./error-controller');

const HomeController = {
  /**
   * Gets home page with main content
   * @param {Object} _req - Express request object (unused)
   * @param {Object} res - Express response object
   */
  getHomePage: async (_req, res) => {
    try {
      await res.render('pages/home', { 
        pageTitle: 'Strona Główna',
        pageName: 'home',
        title: 'Witaj na mojej stronie', 
        subtitle: '',
        heroIcon: 'bi bi-house-door',
        sidebarTitle: 'Panel boczny',
        sidebarContent: 'Tutaj znajdziesz najważniejsze informacje i szybkie linki.',
        sidebarNews: {
          title: 'Aktualności',
          highlight: 'Nowa funkcjonalność!',
          content: 'Właśnie dodaliśmy nowe komponenty Bootstrap do naszej strony.'
        }
      });
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  /**
   * Gets contact page with contact form
   * @param {Object} _req - Express request object (unused)
   * @param {Object} res - Express response object
   */
  getContactPage: async (_req, res) => {
    try {
      await res.render('pages/contact', { 
        pageTitle: 'Kontakt',
        pageName: 'contact',
        phoneNumber: '997 998 999',
        title: 'Kontakt',
        subtitle: 'Skontaktuj się z nami',
        heroIcon: 'bi bi-envelope-heart',
        breadcrumbs: [
          {
            text: 'Kontakt',
            icon: 'bi bi-envelope'
          }
        ],
        // Contact form options
        showPhone: true,
        showPrivacyCheckbox: true,
        showContactInfo: true,
        subjectOptions: [
          { value: 'general', text: 'Pytanie ogólne' },
          { value: 'support', text: 'Wsparcie techniczne' },
          { value: 'business', text: 'Współpraca biznesowa' },
          { value: 'complaint', text: 'Reklamacja' },
          { value: 'other', text: 'Inne' }
        ]
      });
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },

  /**
   * Gets about page with company information
   * @param {Object} _req - Express request object (unused)
   * @param {Object} res - Express response object
   */
  getAboutPage: async (_req, res) => {
    try {
      await res.render('pages/home', { 
        pageTitle: 'O nas',
        pageName: 'about',
        title: 'O nas',
        subtitle: 'Poznaj naszą historię',
        heroIcon: 'bi bi-info-circle',
        breadcrumbs: [
          {
            text: 'O nas',
            icon: 'bi bi-info-circle'
          }
        ],
        sidebarTitle: 'Nasze wartości',
        sidebarContent: 'Jesteśmy zespołem pasjonatów technologii, którzy dążą do tworzenia innowacyjnych rozwiązań.',
        sidebarNews: {
          title: 'Nasze osiągnięcia',
          highlight: 'Ponad 100 projektów!',
          content: 'W ciągu ostatnich lat zrealizowaliśmy ponad 100 projektów dla zadowolonych klientów.'
        }
      });
    } catch (error) {
      ErrorController.handleError(res, error);
    }
  },
};

module.exports = { HomeController }; 