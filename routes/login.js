const express = require("express");
const router = express.Router();
const User = require("../models/User");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const hash = SHA256(req.body.password + user.salt).toString(encBase64);
    if (hash === user.hash) {
      res.json({
        _id: user._id,
        token: user.token,
        account: user.account,
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
});

module.exports = router;
