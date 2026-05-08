const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporterSocketId: { type: String, required: true },
    reportedSocketId: { type: String, required: true },
    reason: {
      type: String,
      enum: ['spam', 'harassment', 'inappropriate_content', 'other'],
      required: true,
    },
    roomId: { type: String },
    details: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
