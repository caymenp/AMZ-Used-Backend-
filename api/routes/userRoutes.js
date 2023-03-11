// const express = require("express");
// const router = express.Router();
// const UserModel = require("../models/userModel");
// const bcrypt = require("bcryptjs");

// //new user
// router.post("/register", async (req, res) => {
//   const user = new UserModel({
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     password: req.body.password,
//   });
//   try {
//     const registerUser = await user.save();
//     res.status(200).json(registerUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// //Get User
// router.post("/login", async (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   //Find user if exists
//   try {
//     const user = await UserModel.findOne({ email }).then((user) => {
//       if (!user) return res.status(400).json({ msg: "Invalid Login" });

//       bcrypt.compare(password, user.password, (err, data) => {
//         if (err) throw err;

//         if (data) {
//           return res.status(200).json({ msg: "Login Successful" });
//         } else {
//           return res.status(401).json({ msg: "Invalid Credentials" });
//         }
//       });
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
