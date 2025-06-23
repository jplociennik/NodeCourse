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

module.exports = { ValidateEmail } 