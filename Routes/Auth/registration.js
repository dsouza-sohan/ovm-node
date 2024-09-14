const express = require("express");
const router = express.Router();
const crypt = require("bcryptjs");

const User = require("../../Model/Auth/user");

const sendEmail = require("../../Middleware/mailer");

router.post("/register", async (req, res) => {
  var userexists = await User.findOne({ email: req.body.email });
  if (userexists) {
    return res.status(400).json({
      code: 400,
      message: "Email is already taken!",
      data: null,
      status: false,
    });
  }
  const salt = await crypt.genSalt(10);
  const hashpassword = await crypt.hash(req.body.password, salt);

  const usr = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.firstname,
    email: req.body.email,
    password: hashpassword,
    phone: req.body.phone,
    gender: req.body.gender,
    role: req.body.role,
    address: req.body.address,
  });

  try {
    var response = await usr.save();

    //send welcome email
    let emailOptions = {
      to: req.body.email,
      subject: "Welcome to Hand 2 Hand community",
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };
    const emailResponse = sendEmail("welcome", emailOptions);

    return res.status(200).json({
      code: 200,
      message: "Registration Successfull!",
      data: response,
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
      status: false,
      code: 500,
      data: null,
    });
  }
});

module.exports = router;
