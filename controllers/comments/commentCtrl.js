const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/Comment");
const validateMongodbId = require("../../utils/validateMongodbID");
const banUser = require("../../utils/banUser");
const User = require("../../model/user/User");
const Filter = require("bad-words");
const PostForum = require("../../model/postForum/PostForum");
//-------------------------------------------------------------
//Create
//-------------------------------------------------------------
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  banUser(req.user);
  //Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.description);
  //ban user
  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBanned: true,
    });
    res.status(401);
    throw new Error(" and you are banned for the bad words");
  }
  //1.Get the user
  const user = req.user;
  //2.Get the postForum Id
  const { postForumId, description } = req.body;
 
  try {
    const comment = await Comment.create({
      postForum: postForumId,
      user,
      description,
    });
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------
//fetch all comments
//-------------------------------

const fetchAllCommentsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({}).sort("-created");
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//commet details
//------------------------------
const fetchCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Update
//------------------------------

const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const update = await Comment.findByIdAndUpdate(
      id,
      {
        postForum: req.body?.postForumId,
        user: req?.user,
        description: req?.body?.description,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(update);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//delete
//------------------------------

const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  deleteCommentCtrl,
  updateCommentCtrl,
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchCommentCtrl,
};
