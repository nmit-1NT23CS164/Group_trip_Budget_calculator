const express = require('express');
const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { trip, description, amount, paidBy, splitAmong, category } = req.body;

    // Validate trip exists and user is a member
    const tripDoc = await Trip.findById(trip);
    if (!tripDoc) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (!tripDoc.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to add expenses to this trip' });
    }

    // Calculate split amounts
    const splitAmount = amount / splitAmong.length;
    const formattedSplitAmong = splitAmong.map(userId => ({
      user: userId,
      amount: splitAmount,
    }));

    const expense = new Expense({
      trip,
      description,
      amount,
      paidBy,
      splitAmong: formattedSplitAmong,
      category,
    });

    await expense.save();
    await expense.populate('paidBy', 'name email');
    await expense.populate('splitAmong.user', 'name email');

    res.status(201).json({
      message: 'Expense created successfully',
      expense,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/expenses/:tripId
// @desc    Get all expenses for a trip
// @access  Private
router.get('/:tripId', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (!trip.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this trip' });
    }

    const expenses = await Expense.find({ trip: req.params.tripId })
      .populate('paidBy', 'name email')
      .populate('splitAmong.user', 'name email')
      .sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/expenses/calculate-settlement/:tripId
// @desc    Calculate settlement - who owes whom
// @access  Private
router.post('/calculate-settlement/:tripId', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate('members', 'name email');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (!trip.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this trip' });
    }

    const expenses = await Expense.find({ trip: req.params.tripId })
      .populate('paidBy')
      .populate('splitAmong.user');

    // Calculate balances
    const balances = {};
    trip.members.forEach(member => {
      balances[member._id] = 0;
    });

    expenses.forEach(expense => {
      balances[expense.paidBy._id] += expense.amount;

      expense.splitAmong.forEach(split => {
        balances[split.user._id] -= split.amount;
      });
    });

    // Convert to array and filter out zero balances
    const settlement = Object.entries(balances)
      .filter(([_, balance]) => Math.abs(balance) > 0.01)
      .map(([userId, balance]) => {
        const user = trip.members.find(m => m._id.toString() === userId);
        return {
          user: {
            id: userId,
            name: user.name,
            email: user.email,
          },
          balance: parseFloat(balance.toFixed(2)),
        };
      });

    // Generate settlement transactions
    const settlements = [];
    const settled = new Set();

    for (let i = 0; i < settlement.length; i++) {
      for (let j = i + 1; j < settlement.length; j++) {
        if (settlement[i].balance > 0.01 && settlement[j].balance < -0.01) {
          const amount = Math.min(settlement[i].balance, -settlement[j].balance);

          settlements.push({
            from: settlement[j].user,
            to: settlement[i].user,
            amount: parseFloat(amount.toFixed(2)),
          });

          settlement[i].balance -= amount;
          settlement[j].balance += amount;
        }
      }
    }

    res.status(200).json({
      balances: settlement,
      settlements,
      totalExpenses: expenses.length,
      totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if user paid the expense (only payer can delete)
    if (expense.paidBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
