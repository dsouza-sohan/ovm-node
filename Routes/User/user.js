const express = require("express");
const router = express.Router();

//User schema import
const User = require("../../Model/Auth/user");
const Car = require("../../Model/Car/car");
const validateToken = require("../../Middleware/auth-middleware").validateToken;
const { uploadFile, deleteFile } = require("../../Middleware/box-upload");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const profieSchema = new Schema({}, { strict: false });

//Packages
var multer = require("multer"); // Package to upload image
// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//get User list
router.get("/", async (req, res) => {
  let matchCondition = {};
  if (req.query && req.query.filter) {
    filter = req.query.filter;
    console.log("filter");
    matchCondition = req.query.filter !== "null" ? { isActive: filter } : {};
  }

  try {
    const user = await User.find(matchCondition);
    const ProfileImage = mongoose.model("profile_images", profieSchema);
    var Images = await ProfileImage.find();

    Images.map((res) => {
      user.map((res1) => {
        if (res1.user_id === res.user_id) {
          res1.profile_image = res;
        }
        return res1;
      });
    });
    res.status(200).json({
      code: 200,
      message: "User list fetched successfully",
      data: user,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error,
      data: null,
      status: false,
    });
  }
});

//get indiviual user details
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).lean();

    const cars = await Car.find({ owner: req.params.userId });
    console.log(cars);
    if (cars) {
      user.my_cars = cars;
    }
    res.status(200).json({
      code: 200,
      message: "User fetched successfully",
      data: user,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error,
      data: null,
      status: false,
    });
  }
});

//Delete User
router.delete("/:userId", async (req, res) => {
  try {
    console.log("here");
    const user = await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({
      code: 200,
      message: "User deleted successfully",
      data: user,
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      message: error,
      data: null,
      status: false,
    });
  }
});

//update user info
router.patch("/:userId", async (req, res) => {
  try {
    const user = await User.updateOne(
      { _id: req.params.userId },
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          email: req.body.email,
          phone: req.body.phone,
          gender: req.body.gender,
        },
      }
    );

    res.status(200).json({
      code: 200,
      message: "User updated successfully",
      data: user,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error,
      data: null,
      status: false,
    });
  }
});

//Add Profile image
router.post(
  "/profile-image",
  validateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log(req.decoded);
      const img_name_parts = req.file.originalname.split(".");
      const img_type = img_name_parts[img_name_parts.length - 1];
      const uploadedData = await uploadFile({
        fileContents: req.file.buffer,
        user_id: req.body.user_id,
        doc_name: img_name_parts[0],
        doc_id: req.body.image_id,
        doc_type: img_type,
      });
      // console.log("uploadedData", uploadedData);
      const ProfileImage = mongoose.model("profile_images", profieSchema);
      const profile_image = new ProfileImage({
        image: uploadedData.shared_link.download_url,
        image_id: uploadedData.id,
        user_id: req.body.user_id,
      });
      var prevImage = await ProfileImage.find({ user_id: req.body.user_id });
      if (prevImage.length > 0) {
        await ProfileImage.deleteMany({ user_id: req.body.user_id });
      }

      var response = await profile_image.save();

      await User.findByIdAndUpdate(
        req.body.user_id,
        { $set: { profImage: uploadedData.shared_link.download_url } },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        code: 200,
        message: "Profile image added successfully..!",
        data: response,
        status: true,
      });
    } catch (err) {
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
