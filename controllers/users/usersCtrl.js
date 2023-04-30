const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/generateToken");
const sgMail = require("@sendgrid/mail");

const crypto = require("crypto");
const User = require("../../model/user/User");
const validateMongodbId = require("../../utils/validateMongodbID");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const fs = require("fs");
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

//Register

const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  const userExists = await User.findOne({ email: req?.body?.email });
  //const localPath = public/images/profile/${req.file.filename};
  //const imgUploaded = await cloudinaryUploadImg(localPath);
  if (userExists) throw new Error("User already exists");
  try {
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
      bio: req?.body?.bio,
      role: req?.body.role,
      associationName: req?.body.associationName,
      associationAdress: req?.body.associationAdress,
      associationPhone: req?.body.associationPhone,
      // profilePhoto: imgUploaded?.url,
      profilePhoto: req?.body.profilePhoto,
    });
    res.json(user);
    //fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
});

//Login
// ban else2 to do

const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email });

  if (userFound && (await userFound.isPasswordMatched(password))) {
      userFound.status = "online";
     await userFound.save();
    if (userFound.isBanned) {
      res.status(401);
      throw new Error("you are banned ");
    } else {
      res.json({
        _id: userFound?._id,
        firstName: userFound?.firstName,
        lastName: userFound?.lastName,
        email: userFound?.email,
        role: userFound?.role,
        profilePhoto: userFound?.profilePhoto,
        isAdmin: userFound?.isAdmin,
        token: generateToken(userFound?._id),
        isAccountVerified:userFound?.isAccountVerified,
      });
    }
  } else {
    res.status(401);
    throw new Error("invalid email or password ");
  }
});

//get all user to test

const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.headers);
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

//User profile

const userProfileCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const myProfile = await User.findById(id);
    res.json(myProfile);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Update profile
//------------------------------
const updateUserCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  validateMongodbId(_id);
  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
      profilePhoto: req?.body?.profilePhoto,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(user);
});

//------------------------------
//Update status for chat
//------------------------------
const updateUserstatus = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  validateMongodbId(_id);
  const user = await User.findByIdAndUpdate(
    _id,
    {
      status: req?.body?.status,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(user);
});

const banUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBanned: true,
    },
    { new: true }
  );
  res.json(user);
});

// unban user

const unbanUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBanned: false,
    },
    { new: true }
  );
  res.json(user);
});
const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
  const loginUserId = req.user.id;

  const user = await User.findById(loginUserId);

  try {
    //Generate token
    const verificationToken = await user?.createAccountVerificationToken();
    //save the user
    await user.save();
    console.log(verificationToken);
    //build your message

    const resetURL =` If you were requested to verify your account, verify now within 10 minutes, otherwise ignore this message <a href="https://givly.onrender.com/verify-account/${verificationToken}">Click to verify your account</a>`;
    const msg = {
      to: user?.email,
      from: "givly2023@gmail.com",
      subject: "My first Node js email sending",
      html: resetURL,
    };

    await sgMail.send(msg);
    res.json(resetURL);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Account verification
//------------------------------

const accountVerificationCtrl = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  //find this user by token

  console.log(hashedToken);
  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });
  if (!userFound) throw new Error("Token expired, try again later");

  console.log(userFound);
  //update the proprt to true
  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;
  await userFound.save();
  res.json(userFound);
});
//------------------------------
//Forget token generator
//------------------------------

const forgetPasswordToken = expressAsyncHandler(async (req, res) => {
  //find the user by email
  const { email } = req.body;

  const user = await User.findOne({ email });
  console.log(user);
  if (!user) throw new Error("User Not Found");

  try {
    //Create token
    const token = await user.createPasswordResetToken();
    

    console.log(token);
    await user.save();

    //build your message
    const resetURL = `If you were requested to reset your password, reset now within 10 minutes, otherwise ignore this message <a href="https://givly.onrender.com/reset-password/${token}">Click to Reset</a>`;
    const msg = {
      to: email,
      from: "givly2023@gmail.com",
      subject: "Reset Password",
      html: resetURL,
    };
    console.log(msg);
    await sgMail.send(msg);
    res.json({
      msg: `A verification message is successfully sent to ${user?.email}. Reset now within 10 minutes, ${resetURL}`,
    });
  } catch (error) {
    res.json({
      message: "this is an error",
    });
  }
});

//------------------------------
//Password reset
//------------------------------

const passwordResetCtrl = expressAsyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  //find this user by token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token Expired, try again later");

  //Update/change the password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

module.exports = {
  userProfileCtrl,
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  userProfileCtrl,
  updateUserCtrl,
  banUserCtrl,
  unbanUserCtrl,
  accountVerificationCtrl,
  generateVerificationTokenCtrl,
  forgetPasswordToken,
  generateVerificationTokenCtrl,
  passwordResetCtrl,
  updateUserstatus,
};