// 1. Zainicjalizuj npm i zainstaluj mongoose
// 2. Połącz się z bazą danych (nazwa dowolna)
// 3. Utwórz model User o polach:
//    - _id
//    - name
//    - email
//    - password
//    - isAdmin
// Wykorzystaj Schema wg zasad:
//    - name, email, password są wymagane
//    - name musi posiadać przynajmniej 3 znaki
//    - waliduj poprawność "email"
//    - zmieniaj "email" na małe litery i wycinaj puste znaki
//    - przed zapisaniem "password" zmień hasło z jawnego tekstu na hash (nie musi być prawdziwy)
//    - (opcjonalnie) przygotuj polskie błędy
//    - isAdmin domyślnie = 0
// 4. Przetestuj powyższe tworząc kilku użytkowników
// 5. Pobierz listę wszystkich użytkowników
// 6. Pobierz konkretnego użytkownika po "email"

const mongoose  = require('mongoose')
const bcrypt = require('bcrypt')

const url = 'mongodb://localhost:27017/node';
mongoose.connect(url);

const ValidateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) throw new Error('Email musi mieć znak @');

    const [localPart, domain] = email.split("@");

    if (localPart.length < 1 || localPart.length > 64) throw new Error('Email do znaku @ musi miec znaki w zakresie od 1 do 64!');
    if (domain.length < 3 || domain.length > 253) throw new Error('Email od znaku @ musi miec znaki w zakresie od 3 do 253!');
    if (domain.startsWith(".")) throw new Error('Email po znaku @ nie może zaczynać się od kropki!');
    if (domain.endsWith(".")) throw new Error('Email po znaku @ nie może kończyć się na kropce!');
    return true;
}

async function hashPassword(doc) {
    if (doc.password) {
        doc.password = await bcrypt.hash(doc.password, 10);
    }
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pole Name jest wymagane!'],
        minLength: [3, 'Pole Name musi mieć conajmniej 3 znaki!']
    },
    email: {
        type: String,
        required: [true, 'Pole email jest wymagane!'],
        unique: true,
        validate: {
            validator: ValidateEmail,
            message: props => `${props.value} nie jest poprawnym adresem email!`
        },
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Pole Password jest wymagane!'],
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        await hashPassword(this);
    }
    next();
});

userSchema.pre('insertMany', async function(next, docs) {
    for (const doc of docs) {
        await hashPassword(doc);
    }
    next();
});

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

async function main() {

    await User.deleteMany({});

    try {
        await User.insertMany(users);
        console.log('Użytkownicy zostali zapisani');
    }
    catch (e) {
        console.log('Błąd na operacjach z bazą danych!')
        for (const key in e.errors) {
            console.log(e.errors[key].message);
        }
    }

    const usersFromDb = await User.find({});
    usersFromDb.forEach(element => {
        console.log(element)
    });

    const oneUserFromDb = await User.findOne({ email: 'adam@gmail.com'});
    console.log(oneUserFromDb);
}

async function runTests() {
    console.log('\n--- TESTY ---');
    const usersFromDb = await User.find({});
    if (usersFromDb.length >= 10) {
        console.log('✅ Użytkownicy zostali zapisani');
    } else {
        console.log('❌ Użytkownicy NIE zostali zapisani');
    }
    const bcryptRegex = /^\$2[aby]\$.{56}$/;
    const allHashed = usersFromDb.every(u => bcryptRegex.test(u.password));
    if (allHashed) {
        console.log('✅ Wszystkie hasła są hashowane (bcrypt)');
    } else {
        console.log('❌ Nie wszystkie hasła są hashowane');
    }

    // 2. Testy walidacji
    const tests = [
        {
            desc: 'Za krótkie imię',
            data: { name: 'Al', email: 'al@al.pl', password: 'abc123' },
        },
        {
            desc: 'Brak emaila',
            data: { name: 'Test', password: 'abc123' },
        },
        {
            desc: 'Zły format emaila',
            data: { name: 'Test', email: 'zlyemail', password: 'abc123' },
        },
        {
            desc: 'Email zaczyna się od kropki po @',
            data: { name: 'Test', email: 'test@.gmail.com', password: 'abc123' },
        },
        {
            desc: 'Email kończy się kropką po @',
            data: { name: 'Test', email: 'test@gmail.com.', password: 'abc123' },
        },
        {
            desc: 'Za krótki local part',
            data: { name: 'Test', email: '@gmail.com', password: 'abc123' },
        },
        {
            desc: 'Za krótki domain part',
            data: { name: 'Test', email: 'test@g.', password: 'abc123' },
        },
        {
            desc: 'Brak hasła',
            data: { name: 'Test', email: 'test@ok.pl' },
        },
        {
            desc: 'Duplikat emaila',
            data: { name: 'Test', email: 'janek@gmail.com', password: 'abc123' },
        },
    ];

    for (const test of tests) {
        try {
            await new User(test.data).save();
            console.log(`❌ ${test.desc} został zaakceptowany`);
        } catch (e) {
            console.log(`✅ ${test.desc} został odrzucony:`, e.message);
        }
    }
}

main()
    .then(runTests)
    .catch(ex => console.log('Db Error:', ex.message))