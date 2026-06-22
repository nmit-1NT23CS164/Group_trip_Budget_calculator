const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide expense description'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide amount'],
    min: 0,
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  splitAmong: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      amount: Number,
    },
  ],
  category: {
    type: String,
    enum: ['food', 'transport', 'accommodation', 'entertainment', 'other'],
    default: 'other',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Expense', expenseSchema);
