const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words");
const fs = require("fs");
const PostForum = require("../../model/postForum/PostForum");
const validateMongodbId = require("../../utils/validateMongodbID");
const User = require("../../model/user/User");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const banUser = require("../../utils/banUser");

//----------------------------------------------------------------
//CREATE POST
//----------------------------------------------------------------
const createPostForumCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  //Display message if user is banned
  banUser(req.user);
  //validateMongodbId(req.body.user);
  //Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);
  //ban user
  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBanned: true,
      
    });
  res.status(401);
  throw new Error(" and you are banned for the bad words");
  }



  // //1. Get the path to img
  const localPath = `public/images/postsForum/${req.file.filename}`;
  // //2.Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);
  try {
    const postForum = await PostForum.create({
      ...req.body,
      user: _id,
      image: imgUploaded?.url,
    });
    console.log(req.user);


    //Remove uploaded img
    fs.unlinkSync(localPath);
    res.json(postForum);
  } catch (error) {
    res.json(error);
  }
});

//-------------------------------
//Fetch al posts
//-------------------------------
const fetchPostsForumCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const postsForum = await PostForum.find({})
       .populate("user")
        .populate("comments")
        .sort("-createdAt");

    res.json(postsForum);
  } catch (error) {}
});

/*const fetchPostsForumCtrl = expressAsyncHandler(async (req, res) => {
  
  try {
 
      const postsForum = await PostForum.find({})
        .populate("user")
        .populate("comments")
        .sort("-createdAt");

      res.json(postsForum);

  } catch (error) {
    res.json(error);
  }
});
*/
//------------------------------
//Fetch a single post
//------------------------------
const fetchPostForumCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const postForum = await PostForum.findById(id)
      .populate("user")
      .populate("disLikes")
      .populate("likes")
      .populate("comments");

  

    let { viewedBy, numViews } = postForum;

   

    const userId = req?.user?.id;

    // Check if the current user has already viewed the post
    const viewedByCurrentUser = viewedBy.includes(userId);

    // If the current user has not viewed the post yet, update the post's viewedBy field
    if (!viewedByCurrentUser) {
      viewedBy.push(userId);
      numViews++;
      postForum.viewedBy = viewedBy;
      postForum.numViews = numViews;
      await postForum.save();


    }

    res.json(postForum);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
// Update post
//------------------------------

const updatePostForumCtrl =expressAsyncHandler(async (req, res) => {
  console.log(req.user);
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const postForum = await PostForum.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req.user?._id,
      },
      {
        new: true,
      }
    );
    res.json(postForum);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Delete Post
//------------------------------

const deletePostForumCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const postForum = await PostForum.findOneAndDelete(id);
    res.json(postForum);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Likes
//------------------------------

const toggleAddLikeToPostForumCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { postForumId } = req.body;
    const postForum = await PostForum.findById(postForumId);
    const loginUserId = req?.user?._id;
    const isLiked = postForum?.likes?.includes(loginUserId);
    const alreadyDisliked = postForum?.disLikes?.includes(loginUserId);

    if (alreadyDisliked) {
      await PostForum.findByIdAndUpdate(
        postForumId,
        {
          $pull: { disLikes: loginUserId },
          isDisLiked: false,
        },
        { new: true }
      );
    }

    if (isLiked) {
      await PostForum.findByIdAndUpdate(
        postForumId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
    } else {
      await PostForum.findByIdAndUpdate(
        postForumId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
    }

    const updatedPostForum = await PostForum.findById(postForumId);
    res.json(updatedPostForum);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//------------------------------
//disLikes
//------------------------------
const toggleAddDislikeToPostForumCtrl = expressAsyncHandler(
  async (req, res) => {
    try {
      const { postForumId } = req.body;
      const postForum = await PostForum.findById(postForumId);
      const loginUserId = req?.user?._id;
      const isDisliked = postForum?.disLikes?.includes(loginUserId);
      const alreadyLiked = postForum?.likes?.includes(loginUserId);

      if (alreadyLiked) {
        await PostForum.findByIdAndUpdate(
          postForumId,
          {
            $pull: { likes: loginUserId },
            isLiked: false,
          },
          { new: true }
        );
      }

      if (isDisliked) {
        await PostForum.findByIdAndUpdate(
          postForumId,
          {
            $pull: { disLikes: loginUserId },
            isDisLiked: false,
          },
          { new: true }
        );
      } else {
        await PostForum.findByIdAndUpdate(
          postForumId,
          {
            $push: { disLikes: loginUserId },
            isDisLiked: true,
          },
          { new: true }
        );
      }

      const updatedPostForum = await PostForum.findById(postForumId);
      res.json(updatedPostForum);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);



module.exports = {
  toggleAddDislikeToPostForumCtrl,
  toggleAddLikeToPostForumCtrl,
  deletePostForumCtrl,
  updatePostForumCtrl,
  createPostForumCtrl,
  fetchPostsForumCtrl,
  fetchPostForumCtrl,
};
