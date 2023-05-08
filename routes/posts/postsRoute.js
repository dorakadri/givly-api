const express = require("express");

const{
    createPost ,
    fetchAllPost,
    addtowishlist,
    removefromwishlist,
    fetchbyid,
    addMatch,
    getUserMatches,
    fetchuserposts,
    updatePost,
    deletePost,
    getUserMatchespost,
    removefromMAtch,
    updateafterscan,
    gettaken
 
}= require("../../controllers/posts/postsCtrl");
const { GiftImgResize } = require("../../middlewares/uploads/profilePhotoUpload");

const postRoutes = express.Router();


postRoutes.post("/:id",createPost);
postRoutes.get("/getall/:id",  fetchAllPost);
postRoutes.get("/:id",fetchbyid);
postRoutes.get("/userposts/:id",fetchuserposts);
postRoutes.get("/Matchuser/:id",getUserMatchespost);
postRoutes.get("/taken/takenuser/:id",gettaken);

postRoutes.put("/:id", updatePost);
postRoutes.delete("/deletepost/:id",  deletePost);


//wishlist operation//

postRoutes.post("/:id/wishlist",addtowishlist);
postRoutes.delete("/:userId/wishlist/:productId",removefromwishlist);
//addmatch
postRoutes.post('/post/add/matches', addMatch);
postRoutes.get('/getmatches/:id',getUserMatches);
postRoutes.delete("/:userId/matches/:productId",removefromMAtch);
//
postRoutes.post("/update/afterscan",updateafterscan);

module.exports = postRoutes;



