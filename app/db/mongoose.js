const mongoose  = require('mongoose');
const { userSchema } = require('./user');
const { taskSchema } = require('./task');
const { databaseConnectionString } = require('../config')

mongoose.connect(databaseConnectionString);

//models
const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

const users = [
    new User({ name: 'Janek', email: 'janek@gmail.com', password: 'Zbyszek42#', createdAt: '2023-01-15' }),
    new User({ name: 'Adam', email: 'adam@gmail.com', password: 'masterkeY1%', isAdmin: true, createdAt: '2023-02-20' }),
    new User({ name: 'Tomasz', email: 'tomek@my.com', password: 'hEhE936!', createdAt: '2023-03-10' }),
    new User({ name: 'Dawid', email: 'dawid@email.com', password: '232Browar11$', createdAt: '2023-04-05' }),
    new User({ name: 'Marta', email: 'marta@wp.pl', password: 'Kot123!', isAdmin: true, createdAt: '2023-05-12' }),
    new User({ name: 'Piotr', email: 'piotr@onet.pl', password: 'Pies456@', createdAt: '2023-06-18' }),
    new User({ name: 'Kasia', email: 'kasia@interia.pl', password: 'Ryba789#', createdAt: '2023-07-22' }),
    new User({ name: 'Marek', email: 'marek@yahoo.com', password: 'Ptak012$', createdAt: '2023-08-30' }),
    new User({ name: 'Ania', email: 'ania@hotmail.com', password: 'Drzewo345%', createdAt: '2023-09-14' }),
    new User({ name: 'Grzegorz', email: 'grzegorz@outlook.com', password: 'Kwiat678!', createdAt: '2023-10-08' }),
    new User({ name: 'Ewa', email: 'ewa@protonmail.com', password: 'Słońce901@', createdAt: '2023-11-25' }),
    new User({ name: 'Michał', email: 'michal@tutanota.com', password: 'Księżyc234#', isAdmin: true, createdAt: '2023-12-03' }),
    new User({ name: 'Ola', email: 'ola@fastmail.com', password: 'Gwiazda567$', createdAt: '2024-01-17' }),
    new User({ name: 'Tomek', email: 'tomek@icloud.com', password: 'Planeta890%', createdAt: '2024-02-29' }),
    new User({ name: 'Agnieszka', email: 'agnieszka@gmail.com', password: 'Ocean123!', createdAt: '2024-03-11' }),
    new User({ name: 'Bartosz', email: 'bartosz@yahoo.com', password: 'Góra456@', createdAt: '2024-04-07' }),
    new User({ name: 'Claudia', email: 'claudia@outlook.com', password: 'Rzeka789#', createdAt: '2024-05-19' }),
    new User({ name: 'Daniel', email: 'daniel@protonmail.com', password: 'Las012$', isAdmin: true, createdAt: '2024-06-23' }),
    new User({ name: 'Edyta', email: 'edyta@hotmail.com', password: 'Pole345%', createdAt: '2024-07-14' }),
    new User({ name: 'Filip', email: 'filip@fastmail.com', password: 'Most678!', createdAt: '2024-08-26' }),
    new User({ name: 'Gabriela', email: 'gabriela@tutanota.com', password: 'Wieża901@', createdAt: '2024-09-12' }),
    new User({ name: 'Hubert', email: 'hubert@icloud.com', password: 'Zamek234#', createdAt: '2024-10-05' }),
    new User({ name: 'Izabela', email: 'izabela@wp.pl', password: 'Woda567$', createdAt: '2024-11-18' }),
    new User({ name: 'Jakub', email: 'jakub@onet.pl', password: 'Ogień890%', createdAt: '2024-12-09' }),
    new User({ name: 'Katarzyna', email: 'katarzyna@interia.pl', password: 'Ziemia123!', isAdmin: true, createdAt: '2025-01-02' })
];

async function initializeDatabase() {
    await User.deleteMany({});

    try {
        await User.insertMany(users);
        console.log('Użytkownicy zostali zapisani');
        
        return true;
    }
    catch (e) {
        console.log('Błąd na operacjach z bazą danych!')
        for (const key in e.errors) {
            console.log(e.errors[key].message);
        }
        return false;
    }
}

module.exports = { User, Task, initializeDatabase }