const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ['À faire', 'En cours', 'Terminée'],
        default: 'À faire'
    },
    priority: {
        type: String,
        enum: ['Basse', 'Moyenne', 'Haute'],
        default: 'Moyenne'
    },
    dueDate: { type: Date },
    history: [
        {
            field: String,
            oldValue: String,
            newValue: String,
            changedAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Todo', todoSchema);
