const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    socketId: { type: String },
    isAnonymous: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0 },
    preferences: {
      mode: { type: String, enum: ['text', 'video', 'both'], default: 'both' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
