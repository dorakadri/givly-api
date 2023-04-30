const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    postForum: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostForum",
      required: [true, "PostForum is required"],
    },
    user: {
      type: Object,
      required: [true, "User is required"],
    },
    description: {
      type: String,
      required: [true, "Comment description is required"],
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
