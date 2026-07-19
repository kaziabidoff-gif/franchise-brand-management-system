const bcrypt = require('bcrypt');
const asyncHandler = require('../utils/asyncHandler');
const userModel = require('../models/user.model');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await userModel.findById(req.user.id);
  res.json({ data: profile });
});

const updateProfile = asyncHandler(async (req, res) => {
  const updates = {
    name: req.body.name,
    phone: req.body.phone,
    avatar_url: req.body.avatar_url
  };

  Object.keys(updates).forEach((key) => {
    if (typeof updates[key] === 'undefined') {
      delete updates[key];
    }
  });

  if (req.body.password) {
    updates.password_hash = await bcrypt.hash(req.body.password, 10);
  }

  const profile = await userModel.update(req.user.id, updates);
  res.json({ data: profile });
});

module.exports = { getProfile, updateProfile };
