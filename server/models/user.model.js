const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate(value) {
        if (!isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    secret: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["User", "VenueOwner"],
      default: "User",
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving the user model
UserSchema.pre("save", async function (next) {
  const user = this;
  try {
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.secret;
  return userObject;
};

UserSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.emailExists = async function (email) {
  return await this.model("User").exists({ email });
};

UserSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return user != null;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
