const express = require("express");

const {
  userRegisterCtrl,
  loginUserCtrl,
  userProfileCtrl,
  fetchUsersCtrl,
  updateUserCtrl,
  banUserCtrl,
  unbanUserCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordToken,
  passwordResetCtrl,
  updateUserstatus,
} = require("../../controllers/users/usersCtrl");
const {
  authMiddleware,
  isAdmin,
} = require("../../middlewares/auth/authMiddleware");

const {
  profilePhotoUpload,
  profilePhotoResize,
} = require("../../middlewares/uploads/profilePhotoUpload");

const userRoutes = express.Router();
//done

userRoutes.post(
  "/register",
  profilePhotoUpload.single("profilePhoto"),
  profilePhotoResize,
  userRegisterCtrl
);

// login if not banned
userRoutes.post("/login", loginUserCtrl);
// profile
userRoutes.get("/profile/:id", authMiddleware, userProfileCtrl);
userRoutes.put("/", authMiddleware, updateUserCtrl);
userRoutes.put("/status", authMiddleware, updateUserstatus);
// Password reset
userRoutes.post("/forget-password-token", forgetPasswordToken);
userRoutes.put("/reset-password", passwordResetCtrl);
//test autorisation
userRoutes.get("/", authMiddleware, isAdmin, fetchUsersCtrl);
// Password

//userRoutes.put("/password", authMiddleware, updateUserPasswordCtrl);
//userRoutes.put("/password", authMiddleware, updateUserPasswordCtrl);
userRoutes.post(
  "/generate-verify-email-token",
  authMiddleware,
  generateVerificationTokenCtrl
);
userRoutes.put("/verify-account/", authMiddleware, accountVerificationCtrl);

// ban unban user
userRoutes.put("/ban-user/:id", banUserCtrl);
userRoutes.put("/unban-user/:id", unbanUserCtrl);

module.exports = userRoutes;
