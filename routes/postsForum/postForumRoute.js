const express = require("express");
const {
  createPostForumCtrl,
  fetchPostsForumCtrl,
  fetchPostForumCtrl,
  updatePostForumCtrl,
  deletePostForumCtrl,
  toggleAddLikeToPostForumCtrl,
  toggleAddDislikeToPostForumCtrl,
} = require("../../controllers/postsForum/postForumCtrl");

const {
  authMiddleware,
  isAdmin,
} = require("../../middlewares/auth/authMiddleware");
const {photoUpload,postForumImgResize,} = require("../../middlewares/uploads/photoUpload");

const postForumRoute = express.Router();

postForumRoute.post(
  "/",
  authMiddleware,
  photoUpload.single("image"),
  postForumImgResize,
  createPostForumCtrl
);
postForumRoute.put("/likes", authMiddleware,toggleAddLikeToPostForumCtrl);
postForumRoute.put("/dislikes", authMiddleware,toggleAddDislikeToPostForumCtrl);
postForumRoute.get("/",fetchPostsForumCtrl);
postForumRoute.get("/:id", authMiddleware,fetchPostForumCtrl);
postForumRoute.put("/:id", authMiddleware,updatePostForumCtrl);
postForumRoute.delete("/:id", authMiddleware,deletePostForumCtrl);
module.exports = postForumRoute;
