const expressAsyncHandler = require("express-async-handler");
const Gift = require("../../model/gift/Gift");
const validateMongodbId = require("../../utils/validateMongodbID");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const cloudinaryUploadImg = require("../../utils/cloudinary");
//---Create--

const createGiftCtrl = expressAsyncHandler(async (req, res) => {
  // not using cloudinary from back anymore
  // const localPath = public/images/gifts/${req.file.filename};

  // const imgUploaded = await cloudinaryUploadImg(localPath);

  try {
    const gift = await Gift.create({
      name: req?.body?.name,
      type: req?.body?.type,
      company: req?.body?.company,
      giftPhoto: req?.body?.giftPhoto,
      giftType: req?.body?.giftType,
    });
    res.json(gift);
    // no need for fs
    /*fs.unlinkSync(localPath);*/
  } catch (error) {
    res.json(error);
  }
});

//--getall -------

const fetchAllGiftCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const gift = await Gift.find({});

    res.json(gift);
  } catch (error) {
    res.json(error);
  }
});

//--delete---

const deleteGiftCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const gift = await Gift.findOneAndDelete(id);
    res.json(gift);
  } catch (error) {
    res.json(error);
  }
});

//---- Update gift--

const updateGiftCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.user);
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const gift = await Gift.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    res.json(gift);
  } catch (error) {
    res.json(error);
  }
});

const fetchById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
 
  try {
    const gift = await Gift.findById(id);
    console.log(gift);
    if (gift) {
      res.json(gift);
    } else {
      res.status(404).json({ message: "Gift not found" });
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createGiftCtrl,
  fetchAllGiftCtrl,
  deleteGiftCtrl,
  updateGiftCtrl,
  fetchById,
};