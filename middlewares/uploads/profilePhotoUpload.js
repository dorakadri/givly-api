const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const multerStorage = multer.memoryStorage();


const multerFilter = (req, file, cb) => {
 
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {

    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const profilePhotoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

//image Resizing
const profilePhotoResize = async (req, res, next) => {

  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));
  next();
};

///giftphoto
const GiftImgResize = async (req, res, next) => {
  //check if there is no file
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/gifts/${req.file.filename}`));
  next();
};
module.exports = { profilePhotoUpload, profilePhotoResize,GiftImgResize };
