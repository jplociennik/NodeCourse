const HomeController = {
  getHomePage: (req, res) => {
    res.render('Pages/home', { 
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
  },

  getContactPage: (req, res) => {
    res.render('Pages/contact', { 
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
  }
};

module.exports = { HomeController }; 