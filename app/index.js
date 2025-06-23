const app = require('./app.js');
const { initializeDatabase } = require('./db/mongoose');
const { runUserDbTests } = require('../tests/userDbTests');
const { port, url } = require('./config')

// Initialize database and run tests
initializeDatabase()
    .then(() => runUserDbTests(false))
    .then(() => {
        app.listen(port, () => {
            console.log(`Serwer działa na porcie ${port}`);
            console.log(`Otwórz ${url}:${port} w przeglądarce`);
        });
    })
    .catch(ex => console.log('Initialization Error:', ex.message));