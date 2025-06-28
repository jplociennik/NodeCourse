const { hashPassword } = require('./extensions')
const { ValidateEmail } = require('./validators')
const { Schema }  = require('mongoose');

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
    timestamps: true // Adds createdAt and updatedAt fields
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

module.exports = { userSchema }