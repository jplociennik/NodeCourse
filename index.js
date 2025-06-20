const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();

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
      title: 'Witaj na mojej stronie', 
      subtitle: 'Przykładowy layout HTML' 
    });
  });
  
  app.get('/kontakt', (req, res) => {
    res.render('Pages/contact', { 
      pageTitle: 'Kontakt',
      phoneNumber: '997 998 999',
      title: 'Kontakt',
      subtitle: 'Skontaktuj się z nami'
    });
  });
  
  app.get('/profile', (req, res) => {
    let html = `Znaleziono ${users.length} profile. <br>`;
    users.forEach(user => html += 
      `- <a href="/profile/${user.id}">${user.name} (id: ${user.id})</a> <br>`);
  
    res.send(html);
  });
  
    // Route dla /profile/:id (bez mode)
  app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(x => x.id === parseInt(id));

    if (!user) {
      return res.send('Nie ma takiego user');
    }

    let html = `Dane użytkownika:: imię "${user.name}"`;
    res.send(html);
  });

  // Route dla /profile/:id/szczegoly
  app.get('/profile/:id/szczegoly', (req, res) => {
    const { id } = req.params;
    const user = users.find(x => x.id === parseInt(id));

    if (!user) {
      return res.send('Nie ma takiego user');
    }

    let html = `Dane użytkownika:: imię "${user.name}", id "${user.id}", email "${user.email}"`;
    res.send(html);
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