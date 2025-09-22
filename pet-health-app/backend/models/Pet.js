const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'other'],
    lowercase: true
  },
  breed: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: 0,
    max: 30
  },
  weight: {
    type: Number,
    min: 0
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    lowercase: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicalHistory: [{
    condition: String,
    date: Date,
    notes: String
  }],
  vaccinations: [{
    vaccine: String,
    date: Date,
    nextDue: Date
  }],
  profileImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pet', petSchema);
