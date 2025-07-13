const { hashPassword, verifyPassword } = require('./extensions')
const { ValidateEmail } = require('./validators')
const { Schema }  = require('mongoose');

const validateUniqueEmail = (error, _, next) => {
    if (error.code === 11000 && error.keyPattern?.email) {
        error.errors = {
            email: { message: 'Ten email jest już zajęty!' }
        };
    }
    next(error);
}

const userSchema = new Schema({
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
}, {
    timestamps: true
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

userSchema.post('save', validateUniqueEmail);

userSchema.methods = {
    async comparePassword(password) {
        return await verifyPassword(password, this.password);
    }
}
module.exports = { userSchema }