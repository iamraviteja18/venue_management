const jwt = require("jsonwebtoken");

const JWT_SECRET                      = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRATION         = process.env.ACCESS_TOKEN_EXPIRATION;
const REFRESH_TOKEN_EXPIRATION        = process.env.REFRESH_TOKEN_EXPIRATION;
const PASSWORD_RESET_TOKEN_EXPIRATION = process.env.PASSWORD_RESET_TOKEN_EXPIRATION;
const PRETFA_TOKEN_EXPIRATION         = process.env.PRETFA_TOKEN_EXPIRATION;

const GenerateToken = (user, type, expiration_time) => {
  const payload = {
    id: user._id,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiration_time });
};

const GenerateAuthTokens = (user) => {
  const accessToken = GenerateToken(user, "access", ACCESS_TOKEN_EXPIRATION);
  const refreshToken = GenerateToken(user, "refresh", REFRESH_TOKEN_EXPIRATION);

  return {
    accessToken,
    refreshToken,
  };
};

const GenerateAuthToken = (user) => {
  const accessToken = GenerateToken(user, "access", ACCESS_TOKEN_EXPIRATION);
  return accessToken;
};

const GeneratePasswordResetToken = (user) => {
  const payload = {
    id: user._id,
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: PASSWORD_RESET_TOKEN_EXPIRATION,
  });
};

const GenerateTicket = (user) => {
  const payload = {
    id: user._id,
  };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: PRETFA_TOKEN_EXPIRATION,
  });
};

const VerifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

const RefreshToken = async (token) => {};

module.exports = {
  GenerateToken,
  GenerateAuthToken,
  GenerateAuthTokens,
  GeneratePasswordResetToken,
  GenerateTicket,
  VerifyToken,
};
