const express = require('express');
const Pet = require('../models/Pet');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all pets for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(pets);
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ message: 'Server error while fetching pets' });
  }
});

// Get a specific pet
router.get('/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user._id });
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json(pet);
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ message: 'Server error while fetching pet' });
  }
});

// Create a new pet
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, breed, age, weight, gender } = req.body;

    const pet = new Pet({
      name,
      type,
      breed,
      age,
      weight,
      gender,
      owner: req.user._id
    });

    await pet.save();

    // Add pet to user's pets array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { pets: pet._id } }
    );

    res.status(201).json({
      message: 'Pet added successfully',
      pet
    });
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({ message: 'Server error while creating pet' });
  }
});

// Update a pet
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, type, breed, age, weight, gender } = req.body;

    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { name, type, breed, age, weight, gender },
      { new: true, runValidators: true }
    );

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json({
      message: 'Pet updated successfully',
      pet
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({ message: 'Server error while updating pet' });
  }
});

// Delete a pet
router.delete('/:id', auth, async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Remove pet from user's pets array
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { pets: pet._id } }
    );

    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ message: 'Server error while deleting pet' });
  }
});

// Add medical history entry
router.post('/:id/medical-history', auth, async (req, res) => {
  try {
    const { condition, date, notes } = req.body;

    const pet = await Pet.findOne({ _id: req.params.id, owner: req.user._id });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    pet.medicalHistory.push({
      condition,
      date: date || new Date(),
      notes
    });

    await pet.save();

    res.json({
      message: 'Medical history added successfully',
      pet
    });
  } catch (error) {
    console.error('Add medical history error:', error);
    res.status(500).json({ message: 'Server error while adding medical history' });
  }
});

module.exports = router;
