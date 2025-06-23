const mongoose  = require('mongoose');
const { userSchema } = require('./user');
const { databaseConnectionString } = require('../config')

mongoose.connect(databaseConnectionString);

const User = mongoose.model('User', userSchema);

const users = [
    new User({ name: 'Janek', email: 'janek@gmail.com', password: 'Zbyszek42#' }),
    new User({ name: 'Adam', email: 'adam@gmail.com', password: 'masterkeY1%', isAdmin: true }),
    new User({ name: 'Tomasz', email: 'tomek@my.com', password: 'hEhE936!' }),
    new User({ name: 'Dawid', email: 'dawid@email.com', password: '232Browar11$' }),
    new User({ name: 'Marta', email: 'marta@wp.pl', password: 'Kot123!', isAdmin: true }),
    new User({ name: 'Piotr', email: 'piotr@onet.pl', password: 'Pies456@' }),
    new User({ name: 'Kasia', email: 'kasia@interia.pl', password: 'Ryba789#' }),
    new User({ name: 'Marek', email: 'marek@yahoo.com', password: 'Ptak012$' }),
    new User({ name: 'Ania', email: 'ania@hotmail.com', password: 'Drzewo345%' }),
    new User({ name: 'Grzegorz', email: 'grzegorz@outlook.com', password: 'Kwiat678!' }),
    new User({ name: 'Ewa', email: 'ewa@protonmail.com', password: 'Słońce901@' }),
    new User({ name: 'Michał', email: 'michal@tutanota.com', password: 'Księżyc234#', isAdmin: true }),
    new User({ name: 'Ola', email: 'ola@fastmail.com', password: 'Gwiazda567$' }),
    new User({ name: 'Tomek', email: 'tomek@icloud.com', password: 'Planeta890%' })
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

module.exports = { User, initializeDatabase }