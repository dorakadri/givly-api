const mongoose = require("mongoose");

const postForumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
    },

    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisLiked: {
      type: Boolean,
      default: false,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    // other fields
    isViewed: { type: Boolean, default: false },

    viewedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Author is required"],
    },
    description: {
      type: String,
      required: [true, "Post description is required"],
    },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2020/10/25/09/23/seagull-5683637_960_720.jpg",
    },
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

//populate comments
postForumSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "postForum",
  localField: "_id",
});

//compile
const PostForum = mongoose.model("PostForum", postForumSchema);

module.exports = PostForum;
