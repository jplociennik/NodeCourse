const { Schema }  = require('mongoose');

const taskSchema = new Schema({
    taskName: {
        type: String,
        required: [true, 'Pole TaskName jest wymagane!'],
        minLength: [3, 'Pole TaskName musi mieć conajmniej 3 znaki!'],
        trim: true
    },
    dateFrom: {
        type: String,
        required: [true, 'Pole dateFrom jest wymagane!'],
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Data musi być w formacie YYYY-MM-DD']
    },
    dateTo: {
        type: String,
        default: null,
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Data musi być w formacie YYYY-MM-DD']
    },
    isDone: {
        type: Boolean,
        default: false
    }
});

module.exports = { taskSchema }