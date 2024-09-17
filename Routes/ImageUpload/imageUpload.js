const express = require("express");
const router = express.Router();

//User schema import
const User = require("../../Model/Auth/user");
const Car = require("../../Model/Car/car");
const validateToken = require("../../Middleware/auth-middleware").validateToken;
const {
  uploadFile,
  uploadMultipleFile,
  getDownloadUrls,
} = require("../../Middleware/box-upload");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const profieSchema = new Schema({}, { strict: false });

//Packages
var multer = require("multer"); // Package to upload image
// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Add Car image
router.post(
  "/car-image/:carId",
  validateToken,
  upload.any(),
  async (req, res) => {
    try {
      let imageData = [];
      if (req.files) {
        await req.files.forEach(async (res1) => {
          const img_name_parts = res1.originalname.split(".");
          const img_type = img_name_parts[img_name_parts.length - 1];
          imageData.push({
            name:
              img_name_parts[0] +
              "" +
              (Math.random() + 1).toString(36).substring(7) +
              img_type,
            stream: res1.buffer,
          });
        });
      }

      const uploadPromises = await uploadMultipleFile(imageData);
      const uploadResults = await Promise.all(uploadPromises);
      const downloadUrls = await getDownloadUrls(uploadResults);
      const response = await Car.findByIdAndUpdate(
        req.params.carId,
        { $set: { images: downloadUrls } },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        code: 200,
        message: "Car images added successfully..!",
        data: response,
        status: true,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        code: 500,
        message: err,
        data: null,
        status: false,
      });
    }
  }
);

module.exports = router;
