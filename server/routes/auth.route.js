const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth.middleware");
const AuthController = require("../controllers/auth.controller");

router.get("/", (req, res) => {
  res.send("Auth Route");
});

// TODO: Need validation middleware
router.get("/me", auth, AuthController.GetMe);
router.post("/register", AuthController.RegisterUser);
router.post("/login", AuthController.LoginUser);
router.post("/mfa", AuthController.VerifyTFA);
router.post("/email-recovery", AuthController.RequestPasswordReset);
router.post("/reset-password", AuthController.ResetPassword);

module.exports = router;
