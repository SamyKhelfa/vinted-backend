const express = require("express");
const mongoose = require("mongoose");
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const router = express.Router();

const User = mongoose.model("User", {
  email: String,
  account: {
    username: String,
    avatar: Object,
  },
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

router.post("/signup", async (req, res) => {
  console.log("route: /user/signup");
  try {
    const password = req.body.password;
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(16);

    const newUser = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
        avatar: req.body.avatar,
      },
      newsletter: req.body.newsletter,
      token: token,
      hash: hash,
      salt: salt,
    });

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      // L'email existe déjà dans la base de données
      res.status(409).json({ message: "Email already exists" });
    } else {
      await newUser.save();
      res.status(201).json({ message: "User registered" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
