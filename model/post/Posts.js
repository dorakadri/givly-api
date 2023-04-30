const mongoose = require('mongoose');
const User = require('../user/User');

const postSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
 
  location: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },
  postPicture: {
    type: String,
    default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['object', 'food'],
    required: true
  },
  isTaken: {
    type: Boolean,
   default:false
  }
}, {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  });

  postSchema.post("findOneAndRemove", async function (doc) {
    try {
      const id = doc._id;
      console.log(id)
      await User.updateMany(
        { 
          $or: [
            { "matches.productId": id },
            { wishlist: id }
          ]
        },
        {
          $pull: {
            "matches.productId": id,
           
            Taken: id,
            wishlist: id
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  });
  

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
