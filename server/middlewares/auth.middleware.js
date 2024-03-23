const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const { permissions } = require("../config/roles");

const User = require("../models/user.model");
const UserService = require("../services/user.service");

const TokenService = require("../services/token.service");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const user = await UserService.GetUserFromToken(token);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .send({ error: "Please authenticate. " + e.message });
  }
};

const hasPermission = (requiredPermissions) => {
  return async (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    const user = await UserService.GetUserFromToken(token);

    const user_permissions = permissions.get(user.role);
    const userHasPermission = requiredPermissions.every((requiredPerm) =>
      user_permissions.includes(requiredPerm)
    );

    if (!userHasPermission) {
      res
        .status(httpStatus.FORBIDDEN)
        .send({ error: "You do not have permission." });
    } else {
      next();
    }
  };
};

module.exports = { auth, hasPermission };
