const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Match = require("./Matches");
//create schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, "First name is required"],
      type: String,
    },
    lastName: {
      required: [true, "Last name is required"],
      type: String,
    },
    profilePhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Hei buddy Password is required"],
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["Admin", "SimpleUser", "Association"],
      required: true,
    },

    associationName: {
      type: String,
    },
    associationAdress: {
      type: String,
    },
    associationPhone: {
      type: Number,
    },
    isAccountVerified: { type: Boolean, default: false },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,

    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    active: {
      type: Boolean,
      default: false,
    },
    newMessages: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      default: "offline",
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    matches: {
      userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      
      }],
      productId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      }],
    },
    matchesAsOwner: {
      userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      
      }],
      productId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      }],
    },

    Taken: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    Ownposts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    Rankpoints: Number,
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

// password crypttt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("ffgfr ");
  next();
});

//match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createAccountVerificationToken = async function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000;
  return verificationToken;
};
//Password reset/forget

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 minutes
  return resetToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;