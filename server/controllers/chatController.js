const Report = require('../models/Report');

exports.submitReport = async (req, res) => {
  try {
    const { reportedSocketId, reason, roomId, details } = req.body;
    const reporterSocketId = req.headers['x-socket-id'];

    if (!reportedSocketId || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const report = await Report.create({
      reporterSocketId,
      reportedSocketId,
      reason,
      roomId,
      details,
    });

    res.status(201).json({ message: 'Report submitted. Thank you.', id: report._id });
  } catch (err) {
    console.error('[Report error]', err);
    res.status(500).json({ error: 'Failed to submit report' });
  }
};
