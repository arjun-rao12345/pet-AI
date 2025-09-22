const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    image: {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: null
    },
    vetRecommendation: {
      type: Boolean,
      default: false
    }
  }],
  sessionId: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
chatSchema.index({ user: 1, pet: 1, createdAt: -1 });
chatSchema.index({ sessionId: 1 });

module.exports = mongoose.model('Chat', chatSchema);
