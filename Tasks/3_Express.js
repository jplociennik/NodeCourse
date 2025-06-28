// 1. Postaw web serwer za pomocą biblioteki "express"
// Serwer powinien obsługiwać 4 adresy:
// strona główna:    GET /
// kontakt:          GET /kontakt
// użytkownicy:      GET /profile
// użytkownicy:      GET /profile/:id/:mode?

import express from 'express';

const port = 3000;
const app = express();

// Przykładowa tabela użytkowników:
const users = [
  { id: 1, name: 'Janek', email: 'janek@gmail.com' },
  { id: 2, name: 'Adam', email: 'adam@gmail.com' },
  { id: 3, name: 'Tomasz', email: 'tomek@my.com' },
  { id: 4, name: 'Dawid', email: 'dawid@email.com' },
];

app.get('/', (req, res) => {
  res.send('Main Page')
});

app.get('/kontakt', (req, res) => {
  res.send('Contact Info')
});

// Rezultat /profile
// `Znaleziono 4 profile.
// - <a href="/profile/1">Janek (id: 1)</a>
// - Adam (id: 2)
// - Tomasz (id: 3)
// - Dawid (id: 4) `

app.get('/profile', (req, res) => {

  const profiles = users.map(user =>
    `- <a href="/profile/${user.id}"> ${user.name} (id: ${user.id})</a>`
  ).join('<br>');

  res.send(`Znaleziono ${users.length} profile.<br>${profiles}`);
});

// // Rezultat /profile/1
// `Dane użytkownika:: imię "Janek" `

// // Rezultat /profile/1/szczegoly
// `Dane użytkownika:: imię "Janek", id "1", email "janek@gamil.com"`

app.get('/profile/:id/:mode?', (req, res) => {
  const { id, mode = '' } = req.params;

  const user = users.find(x => x.id === Number(id));
  if (!user) return res.send(`Nie ma takiego użytkownika o id ${id}`);

  let text = `Dane użytkownika:: imię: "${user.name}"`;
  if (mode === 'szczegoly') {
    text += `, id: "${user.id}", email: "${user.email}"`;
  }

  res.send(text);
});

app.listen(port);