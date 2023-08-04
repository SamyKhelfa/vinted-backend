const express = require("express");
const router = express.Router();
const User = require("../models/User");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

router.post("/signup", async (req, res) => {
  try {
    // vérifier si l'email existe déjà
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // vérifier si le nom d'utilisateur est renseigné
    if (!req.body.username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const salt = uid2(16);
    const newUser = new User({
      email: req.body.email,
      account: {
        username: req.body.username,
        avatar: req.body.avatar,
      },
      newsletter: req.body.newsletter,
      token: uid2(16),
      hash: SHA256(req.body.password + salt).toString(encBase64),
      salt: salt,
    });

    await newUser.save();

    res.json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
