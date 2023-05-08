const express = require("express");
const {
    createGiftCtrl,
    fetchAllGiftCtrl,
    deleteGiftCtrl,
    updateGiftCtrl,
    fetchById,
    fetchgiftbyuserid,
} = require("../../controllers/gift/giftCtrl");
const { GiftImgResize, profilePhotoUpload } = require("../../middlewares/uploads/profilePhotoUpload");


const giftsRoutes = express.Router();

giftsRoutes.post("/",profilePhotoUpload.single("giftPhoto"),GiftImgResize, createGiftCtrl);

giftsRoutes.get("/all/gift/all", fetchAllGiftCtrl);
giftsRoutes.get("/:id", fetchById);

giftsRoutes.delete("/:id",  deleteGiftCtrl);

giftsRoutes.put("/:id",  updateGiftCtrl);
giftsRoutes.get("/gift/:id",fetchgiftbyuserid)

module.exports = giftsRoutes;