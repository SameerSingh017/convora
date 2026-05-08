exports.getStatus = (req, res) => {
  res.json({ anonymous: true, message: 'Convora requires no login' });
};
