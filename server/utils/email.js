const APP_URL = process.env.URI;
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

const SendPasswordResetEmail = async (emailAddress, token) => {
  const message = mg.messages.create(process.env.MAILGUN_DOMAIN, {
    from: "Password Reset <no-reply@" + process.env.MAILGUN_DOMAIN + ">",
    to: [emailAddress],
    subject: "Password Reset",
    text: "Here's your password reset token: " + APP_URL + "/reset/" + token,
  });
  return message;
};

module.exports = {
  SendPasswordResetEmail,
};
