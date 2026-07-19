const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const userModel = require('../models/user.model');
const { env } = require('../config/env');

const publicUser = (user) => {
  const { password_hash: passwordHash, ...safeUser } = user;
  return safeUser;
};

const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      role: user.role_slug
    },
    env.jwt.secret,
    {
      expiresIn: env.jwt.expiresIn
    }
  );

const login = asyncHandler(async (req, res) => {
  console.log('LOGIN REQUEST RECEIVED');
  console.log(req.body);

  const user = await userModel.findByEmail(req.body.email);

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(
    req.body.password,
    user.password_hash
  );

  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'This account is inactive.');
  }

  await userModel.updateLastLogin(user.id);

  const token = signToken(user);

  res.cookie(env.jwt.cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    maxAge: 24 * 60 * 60 * 1000
  });

  console.log('LOGIN SUCCESS');

  res.json({
    token,
    user: publicUser(user)
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    user: req.user
  });
});

const logout = (req, res) => {
  res.clearCookie(env.jwt.cookieName);

  res.json({
    message: 'Logged out successfully.'
  });
};

module.exports = {
  login,
  me,
  logout
};