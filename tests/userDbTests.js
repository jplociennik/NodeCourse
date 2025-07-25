const { User } = require('../app/db/mongoose')

async function runUserDbTests(verbose = true, skipTests = true) {
    if(skipTests) return;
    if (verbose) {
        console.log('\n--- TESTY ---');
    }
    
    let allTestsPassed = true;
    let failedTests = [];
    
    // Test 1: Sprawdź czy użytkownicy są zapisani
    const usersFromDb = await User.find({});
    if (usersFromDb.length < 10) {
        allTestsPassed = false;
        failedTests.push('Użytkownicy NIE zostali zapisani');
        if (verbose) console.log('❌ Użytkownicy NIE zostali zapisani');
    } else {
        if (verbose) console.log('✅ Użytkownicy zostali zapisani');
    }
    
    // Test 2: Sprawdź hashowanie haseł
    const bcryptRegex = /^\$2[aby]\$.{56}$/;
    const allHashed = usersFromDb.every(u => bcryptRegex.test(u.password));
    if (!allHashed) {
        allTestsPassed = false;
        failedTests.push('Nie wszystkie hasła są hashowane');
        if (verbose) console.log('❌ Nie wszystkie hasła są hashowane');
    } else {
        if (verbose) console.log('✅ Wszystkie hasła są hashowane (bcrypt)');
    }

    // Testy walidacji
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
            allTestsPassed = false;
            failedTests.push(`${test.desc} został zaakceptowany`);
            if (verbose) console.log(`❌ ${test.desc} został zaakceptowany`);
        } catch (e) {
            if (verbose) console.log(`✅ ${test.desc} został odrzucony:`, e.message);
        }
    }
    
    if (!verbose) {
        if (allTestsPassed) {
            console.log('✅ Wszystkie testy przeszły pomyślnie');
        } else {
            console.log('❌ Niektóre testy nie przeszły:');
            failedTests.forEach(test => console.log(`   - ${test}`));
        }
    }
    
    return allTestsPassed;
}

module.exports = { runUserDbTests }