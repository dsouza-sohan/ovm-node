const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../../Model/user");
const passwordResetToken = require("../../Model/passwordReset");

const sendEmail = require("../../Middleware/mailer");
const angular_admin = process.env.ANGULAR_ADMIN
const angular_user = process.env.ANGULAR_USER

router.post("/reset-password-link/:type?", async function (req, res) {
	var type = 'admin'
	console.log("passs");
	console.log(req.query.type);

	if(req.query) {
		type = req.query.type
	}

	if (!req.body.email) {
		return res.status(500).json({ message: "Email is required" });
	}
	const user = await User.findOne({
		email: req.body.email,
	});
	if (!user) {
		return res.status(409).json({ message: "Email does not exist" });
	}
	var resettoken = new passwordResetToken({
		_userId: user._id,
		resettoken: crypto.randomBytes(16).toString("hex"),
	});
	resettoken.save(function (err) {
		if (err) {
			return res.status(500).json({ 
				code:500,
				message:err.message,
				data:null,
				status: false 
			});
		}
		passwordResetToken
			.find({
				_userId: user._id,
				resettoken: { $ne: resettoken.resettoken },
			})
			.remove()
			.exec();
		res.status(200).json({ 
			code:200,
            data:null,
            status: true,
			message: "Reset Password successfully." 
		});
		var transporter = nodemailer.createTransport({
			port: 465,
			host: "smtp.gmail.com",
			auth: {
				user: "vamore5996@gmail.com",
				pass: "V@ibhavi511",
			},
		});

		
		var mailOptions = {
			to: user.email,
			from: "your email",
			subject: "Password Reset",
			text:
				"You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
				"Please click on the following link, or paste this into your browser to complete the process:\n\n" +
				""+angular_admin+"login/password/reset-password/" +
				resettoken.resettoken +
				"\n\n" +
				"If you did not request this, please ignore this email and your password will remain unchanged.\n",
		};

		if(type == 'user') {
			var mailOptions = {
				to: user.email,
				from: "your email",
				subject: "Password Reset",
				text:
					"You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
					"Please click on the following link, or paste this into your browser to complete the process:\n\n" +
					""+angular_user+"password/reset-password/" +
					resettoken.resettoken +
					"\n\n" +
					"If you did not request this, please ignore this email and your password will remain unchanged.\n",
			};
		}
		transporter.sendMail(mailOptions, (err, info) => {});
	});
});

router.post("/reset-password", async function (req, res) {
	if (!req.body.resettoken) {
		return res.status(500).json({ 
			code:500,
            data:null,
            status: false,
			message: "Token is required" 
		});
	}
	const user = await passwordResetToken.findOne({
		resettoken: req.body.resettoken,
	});
	if (!user) {
		return res.status(409).json({ 
			code:400,
            data:null,
            status: false,
			message: "Invalid URL" 
		});
	}

	passwordResetToken.findOne(
		{ resettoken: req.body.resettoken },
		function (err, userToken, next) {
			if (!userToken) {
				return res.status(400).json({ 
					code:400,
					data:null,
					status: false,
					message: "Token has expired" 
				});
			}

			User.findOne(
				{
					_id: userToken._userId,
				},
				function (err, userEmail, next) {
					if (!userEmail) {
						return res
							.status(400)
							.json({ 
								code:400,
								data:null,
								status: false,
								message: "User does not exist" });
					}
					return bcrypt.hash(
						req.body.newPassword,
						10,
						(err, hash) => {
							if (err) {
								return res
									.status(400)
									.json({
										code:400,
										data:null,
										status: false,
										message: "Error hashing password"
									});
							}
							userEmail.password = hash;
							userEmail.save(function (err) {
                                console.log("error here");
                                console.log(err);
								if (err) {
									return res
										.status(400)
										.json({
											code:400,
											data:null,
											status: false,
											message: "Password can not reset.",
										});
								} else {
									userToken.deleteOne();
									return res
										.status(200)
										.json({
											code:200,
											data:null,
											status: true,
											message: "Password reset successfully",
										});
								}
							});
						}
					);
				}
			);
		}
	);
});

module.exports = router;
