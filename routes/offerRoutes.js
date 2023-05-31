const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");

const router = express.Router();

const token = "mySuperSecretToken";

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      req.user = user;
      return next();
    }
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

router.get("/", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/offer/publish", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const Offer = mongoose.model("Offer", {
  product_name: String,
  product_description: String,
  product_price: Number,
  product_details: {
    marque: String,
    taille: Number,
    etat: String,
    couleur: String,
    emplacement: String,
  },
  product_image: Object,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

router.post("/publish", isAuthenticated, async (req, res) => {
  console.log("route: /offer/publish");
  console.log(req.body);
  try {
    const newOffer = new Offer({
      product_name: req.body.product_name,
      product_description: req.body.product_description,
      product_price: req.body.product_price,
      product_details: [
        req.body.marque,
        req.body.taille,
        req.body.etat,
        req.body.couleur,
        req.body.emplacement,
      ],
      product_image: req.body.product_image,
    });

    await newOffer.save();
    res.status(201).json(newOffer);
    console.log(newOffer);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
});

module.exports = router;
