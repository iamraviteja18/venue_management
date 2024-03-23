const mongoose = require("mongoose");
const User = require("../models/user.model");
const TokenService = require("./token.service");

const CreateUser = async (user_body) => {
  if (await User.isEmailTaken(user_body.email)) {
    throw new Error("Email is already taken");
  } else {
    return await User.create(user_body);
  }
};

const GetUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const GetUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("User not found");
  }
};

const GetUserFromToken = async (token) => {
  try {
    const decoded = TokenService.VerifyToken(token);
    const user = await GetUserById(decoded.id);
    return user;
  } catch (error) {
    throw new Error("Can't resolve token to user");
  }
};

module.exports = {
  CreateUser,
  GetUserByEmail,
  GetUserById,
  GetUserFromToken,
};
