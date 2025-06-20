const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

//View Engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, '/Views'));
//Layouts
app.use(expressEjsLayouts)
app.set('layout', './layouts/main')

const users = [
    { id: 1, name: 'Janek', email: 'janek@gmail.com', },
    { id: 2, name: 'Adam', email: 'adam@gmail.com' },
    { id: 3, name: 'Tomasz', email: 'tomek@my.com' },
    { id: 4, name: 'Dawid', email: 'dawid@email.com' },
  ];
  
  
  app.get('/', (req, res) => {
    res.render('Pages/home', { 
      pageTitle: 'Strona Główna',
      pageName: 'home',
      currentPage: 'home',
      title: 'Witaj na mojej stronie', 
      subtitle: 'Przykładowy layout HTML',
      heroIcon: 'bi bi-house-door',
      sidebarTitle: 'Panel boczny',
      sidebarContent: 'Tutaj znajdziesz najważniejsze informacje i szybkie linki.',
      sidebarNews: {
        title: 'Aktualności',
        highlight: 'Nowa funkcjonalność!',
        content: 'Właśnie dodaliśmy nowe komponenty Bootstrap do naszej strony.'
      }
    });
  });
  
  app.get('/kontakt', (req, res) => {
    res.render('Pages/contact', { 
      pageTitle: 'Kontakt',
      pageName: 'contact',
      currentPage: 'contact',
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
  });
  
  app.get('/profile', (req, res) => {
    res.render('Pages/profile-list', {
      pageTitle: 'Profile użytkowników',
      pageName: 'profile',
      currentPage: 'profile',
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
  });
  
    // Route dla /profile/:id (bez mode)
  app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(x => x.id === parseInt(id));

    if (!user) {
      return res.status(404).render('errors/user-not-found', {
        layout: './layouts/error',
        pageTitle: 'Użytkownik nie znaleziony',
        userId: id
      });
    }

    res.render('Pages/profile-single', {
      pageTitle: `Profil - ${user.name}`,
      pageName: 'profile',
      currentPage: 'profile',
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
  });

  // Route dla /profile/:id/szczegoly
  app.get('/profile/:id/szczegoly', (req, res) => {
    const { id } = req.params;
    const user = users.find(x => x.id === parseInt(id));

    if (!user) {
      return res.status(404).render('errors/user-not-found', {
        layout: './layouts/error',
        pageTitle: 'Użytkownik nie znaleziony',
        userId: id
      });
    }

    res.render('Pages/profile-details', {
      pageTitle: `Szczegóły - ${user.name}`,
      pageName: 'profile',
      currentPage: 'profile',
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
  });
  
  app.use((req, res) => {
    res.status(404).render('errors/404', { 
      layout: './layouts/error',
      pageTitle: 'Błąd 404 - Strona nie znaleziona'
    })
  })

  app.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
    console.log('Otwórz http://localhost:3000 w przeglądarce');
  });