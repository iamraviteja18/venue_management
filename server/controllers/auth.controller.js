const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const httpStatus = require("http-status");

const UserService = require("../services/user.service");
const TokenService = require("../services/token.service");
const EmailUtil = require("../utils/email");

const GetMe = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const user = await UserService.GetUserFromToken(token);

    res.status(httpStatus.OK).send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

const RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const tfasecret = speakeasy.generateSecret({ length: 20 });

    const user = await UserService.CreateUser({
      name: name,
      email: email,
      password: password,
      secret: tfasecret.base32,
    });

    const token = TokenService.GenerateAuthToken(user);

    // URL to add to password manager/Google Auth app
    const tfa_url = speakeasy.otpauthURL({
      secret: tfasecret.ascii,
      label: process.env.APP_NAME + " (" + user.email + ")",
      algorithm: "SHA1",
    });

    const qr = await qrcode.toDataURL(tfa_url);

    const ticket = TokenService.GenerateTicket(user);

    res.status(httpStatus.OK).send({
      qr: qr,
      uid: user._id,
      token: token,
      ticket: ticket,
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.GetUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      throw new Error("Invalid login credentials");
    }

    if (user.secret) {
      const ticket = TokenService.GenerateTicket(user);
      res.status(httpStatus.OK).send({
        mfa: true,
        uid: user._id,
        ticket: ticket,
      });
    } else {
      // No 2FA enabled
      const token = TokenService.GenerateAuthToken(user);
      res.status(httpStatus.OK).send({
        mfa: false,
        uid: user._id,
        token: token,
      });
    }
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

const VerifyTFA = async (req, res) => {
  try {
    const { ticket, code } = req.body;
    const decoded = TokenService.VerifyToken(ticket);
    const user = await UserService.GetUserById(decoded.id);

    if (!user) {
      throw new Error("Invalid token");
    }

    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: "base32",
      token: code,
    });

    if (!verified) {
      throw new Error("Invalid TFA code");
    }

    const token = TokenService.GenerateAuthToken(user);
    res.status(httpStatus.OK).send({
      mfa: true,
      uid: user._id,
      token: token,
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

const LogoutUser = async (req, res) => {
  //   TODO: Maintain a blacklist of tokens in mongodb?
};

const RequestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserService.GetUserByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const token = TokenService.GeneratePasswordResetToken(user);

    const message = await EmailUtil.SendPasswordResetEmail(email, token);

    if (message) {
      res.status(httpStatus.OK).send({ message: "Password reset email sent" });
    } else {
      throw new Error("Error sending password reset email");
    }
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = TokenService.VerifyToken(token);
    const user = await UserService.GetUserById(decoded.id);

    if (!user) {
      throw new Error("User not found");
    }

    user.password = password;
    await user.save();

    res.status(httpStatus.OK).send({ message: "Password reset successful" });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

module.exports = {
  GetMe,
  RegisterUser,
  LoginUser,
  VerifyTFA,
  RequestPasswordReset,
  ResetPassword,
};
