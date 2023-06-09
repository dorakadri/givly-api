const Post = require('../../model/post/Posts');
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../../utils/validateMongodbID");
const express = require("express");
const User = require('../../model/user/User');
const Match = require('../../model/user/Matches');
const createPost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.create({
      userId: id,
      location: req?.body?.location,
      description: req?.body?.description,
      postPicture: req?.body?.postPicture,
      createdAt: req?.body?.createdAt,
      title: req?.body?.title,
      type: req?.body?.type,
    });
    await User.findByIdAndUpdate(id, { $push: { Ownposts: post._id } });
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});
//update post 
const updatePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByIdAndUpdate(
      id,
    {
      ...req.body,
    },
    {
      new: true,
    }
    );
    
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});
const deletePost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findOneAndRemove({ _id: id });
   
    res.json(post);
  
  } catch (error) {
    res.json(error);
  }
});

const fetchAllPost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    const posts = await Post.find({
      $and: [
        { _id: { $nin: [...user.Ownposts, ...user.wishlist, ...user.Taken] } },
        { _id: { $nin: user.matches.productId } }
      ]
    }).populate('userId', 'firstName lastName profilePhoto location');

    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});

  

  const removefromwishlist = expressAsyncHandler(async (req, res) => {
    try {
      const { userId, productId } = req.params;
   
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { wishlist: productId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json(user.wishlist);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  const removefromMAtch = expressAsyncHandler(async (req, res) => {
    try {
      const { userId, productId } = req.params;
      const product = await Post.findById(productId)
      if (!product) {
        return res.status(404).json({ error: "ost not found" });
      }
  
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $pull: {
            "matches.productId": productId,
       
          }
        },
        { new: true }
      );
      const owner = await User.findByIdAndUpdate(
        product.userId,
        {
          $pull: {
            "matchesAsOwner.productId": productId,
        
          }
        },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!owner) {
        return res.status(404).json({ error: "owner not found" });
      }
      return res.json(user.matches.productId);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  //Wishlist operations//

 const addtowishlist=expressAsyncHandler(async(req,res)=>{
  const { id } = req.params;
  const { _id } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $addToSet: { wishlist: _id } },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    return res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
 }) 

 const fetchbyid = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const post = await Post.findById(id).populate("userId", "firstName lastName profilePhoto location");

    if ( post) {
      res.json( post);
    } else {
      res.status(404).json({ message: " post not found" });
    }
  } catch (error) {
    res.json(error);
  }
});

//updateusermatches 
const addMatch = expressAsyncHandler(async (req, res) => {
  const { userId, postId, ownerId } = req.body;

  try {

    const user = await User.findById(userId);
    const owner = await User.findById(ownerId);
    if (userId === ownerId) {
    
      res.status(404).json({ message: `user is the same` });
 
    }
    if (!user) {
     
      res.status(404).json({ message: `User with id ${userId} not found` });
 
    }
    if (!owner) {
      
      res.status(404).json({ message: `User with id ${ownerId} not found` });
 
    }

    const userIds = user.matches.userId;
    const productIds = user.matches.productId;

   const ownerIds = owner.matchesAsOwner.userId;
   const ownerproductIds = owner.matchesAsOwner.productId;

    if (userIds.includes(ownerId) && productIds.includes(postId)) {
      res.json({ message: "Match already exists" });
       return
    }
    if (!userIds.includes(ownerId)) {
   
      user.matches.userId.push(ownerId);
    }

    if (!productIds.includes(postId)) {
   
      user.matches.productId.push(postId);
    }
    ////////////////
   if (ownerIds.includes(userId) && ownerproductIds.includes(postId)) {
      res.json({ message: "Match already exists" });
       return
    }
    if (!ownerIds.includes(userId)) {
    
      owner.matchesAsOwner.userId.push(userId);
    }

    if (!ownerproductIds.includes(postId)) {
   
      owner.matchesAsOwner.productId.push(postId);
    }


    ///////////////////
   await owner.save();
   await user.save();

  

    res.json({ message: "Match added successfully" });
  } catch (error) {
    console.log(error)
    res.json(error);
  }
});

//get users post 
const fetchuserposts = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: `User with id ${id} not found` });
      return;
    }


    const posts = await Post.find({
      _id: { $in: user.Ownposts }
    }).populate("userId", "firstName lastName profilePhoto location  ");

 
    const validPostIds = posts.map(post => post._id.toString());
    const invalidIds = user.Ownposts.filter(id => !validPostIds.includes(id.toString()));


    if (invalidIds.length > 0) {
      user.Ownposts = user.Ownposts.filter(id => !invalidIds.includes(id.toString()));
      await user.save();
    }

    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});







//getownerposts
const getUserMatches = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)

    if (!user) {
      res.status(404).json({ message: `User with id ${id} not found` });
      return;
    }
    const userIds = user.matches.userId;
    const userIdsAsOwner = user.matchesAsOwner.userId;
    const allUserIds = [...userIds, ...userIdsAsOwner];
    const uniqueUserIds = [...new Set(allUserIds)];
    const users = await User.find({ _id: { $in: uniqueUserIds } });
    
    const matchedUsers = users.map(u => ({ 
      id: u._id, 
      firstName: u.firstName, 
      lastName: u.lastName,
      profilePhoto: u.profilePhoto 
    }));
  
    res.status(200).json(matchedUsers);
  } catch (error) {
    res.json(error);
  }
});
const getUserMatchestest = expressAsyncHandler(async (id) => {


  try {
    const user = await User.findById(id)

    if (!user) {
      res.status(404).json({ message: `User with id ${id} not found` });
      return;
    }
    const userIds = user.matches.userId;
    const userIdsAsOwner = user.matchesAsOwner.userId;
    const allUserIds = [...userIds, ...userIdsAsOwner];
    const uniqueUserIds = [...new Set(allUserIds)];
    const users = await User.find({ _id: { $in: uniqueUserIds } });
    
    const matchedUsers = users.map(u => ({ 
      id: u._id, 
      firstName: u.firstName, 
      lastName: u.lastName,
      profilePhoto: u.profilePhoto 
    }));
  
   return matchedUsers
  } catch (error) {
  console.log("error")
  }
});

//getpostswanted
const getUserMatchespost = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)

    if (!user) {
      res.status(404).json({ message: `User with id ${id} not found` });
      return;
    }
    const postIds = user.matches.productId;

   const   posts = await Post.find({ _id: { $in: postIds } }).populate("userId", "firstName lastName profilePhoto location");
      const validPostIds = posts.map(post => post._id.toString());
      const invalidIds = user.matches.productId.filter(id => !validPostIds.includes(id.toString()));
  
  
      if (invalidIds.length > 0) {
        user.matches.productId = user.matches.productId.filter(id => !invalidIds.includes(id.toString()));
        await user.save();
      }
    res.status(200).json(posts);
  } catch (error) {
    res.json(error);
  }
});
//gettaken 
const gettaken = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)

    if (!user) {
      res.status(404).json({ message: `User with id ${id} not found` });
      return;
    }
    const postIds = user.Taken;

   const   posts = await Post.find({ _id: { $in: postIds } }).populate("userId", "firstName lastName profilePhoto location");
    
    res.status(200).json(posts);
  } catch (error) {
    res.json(error);
  }
});
/////update after scan 
const updateafterscan = expressAsyncHandler(async (req, res) => {


  try {
   

const taker = await User.findById(req.body.Taker)
const owner = await User.findById(req.body.Owner)

await Post.updateOne({_id:req.body.Post},{isTaken:true})

if (!taker.Taken.includes(req.body.Post)) {
  
  taker.Taken.push(req.body.Post);
}

taker.matches.productId.pull(req.body.Post);
taker.Rankpoints = taker.Rankpoints+5; 
owner.Rankpoints= owner.Rankpoints +10;
await taker.save();
await owner.save();
      giveGift(req.body.Taker);
      giveGift(req.body.Owner);



    res.status(200)
  } catch (error) {
    res.json(error);
  }
});


  

module.exports = {
    createPost ,
    fetchAllPost,
    addtowishlist,
    removefromwishlist,
    fetchbyid,
    addMatch,
    getUserMatches,
    fetchuserposts,
    updatePost ,
    deletePost,
    getUserMatchespost,
    removefromMAtch,
    getUserMatchestest,
    updateafterscan,
    gettaken

  };
