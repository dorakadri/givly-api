const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    }
  });

  const Match = mongoose.model("Match", matchSchema);

module.exports = Match;