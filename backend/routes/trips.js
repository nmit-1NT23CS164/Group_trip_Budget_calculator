const express = require('express');
const Trip = require('../models/Trip');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/trips
// @desc    Create a new trip
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, startDate, endDate, budget } = req.body;

    const trip = new Trip({
      name,
      description,
      startDate,
      endDate,
      budget,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    await trip.save();
    await trip.populate('createdBy members', 'name email');

    res.status(201).json({
      message: 'Trip created successfully',
      trip,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trips
// @desc    Get all trips for the current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ members: req.user.id })
      .populate('createdBy members', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trips/:id
// @desc    Get a specific trip
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('createdBy members', 'name email');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is a member
    if (!trip.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this trip' });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/trips/:id
// @desc    Update a trip
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is the creator
    if (trip.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this trip' });
    }

    const { name, description, startDate, endDate, budget } = req.body;

    trip.name = name || trip.name;
    trip.description = description || trip.description;
    trip.startDate = startDate || trip.startDate;
    trip.endDate = endDate || trip.endDate;
    trip.budget = budget || trip.budget;

    await trip.save();
    await trip.populate('createdBy members', 'name email');

    res.status(200).json({
      message: 'Trip updated successfully',
      trip,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/trips/:id/members
// @desc    Add a member to a trip
// @access  Private
router.post('/:id/members', protect, async (req, res) => {
  try {
    const { userId } = req.body;

    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (!trip.members.includes(userId)) {
      trip.members.push(userId);
      await trip.save();
      await trip.populate('createdBy members', 'name email');
    }

    res.status(200).json({
      message: 'Member added successfully',
      trip,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user is the creator
    if (trip.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this trip' });
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
