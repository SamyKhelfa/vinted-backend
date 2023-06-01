const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");

const router = express.Router();

const token = "mySuperSecretToken";

const Offer = require("../models/offer");
const User = require("../models/user");

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

router.post("/publish", isAuthenticated, async (req, res) => {
  console.log("route: /offer/publish");
  console.log(req.body);
  try {
    const newOffer = new Offer({
      product_name: req.body.name,
      product_description: req.body.description,
      product_price: req.body.price,
      product_details: [
        req.body.marque,
        req.body.taille,
        req.body.etat,
        req.body.couleur,
        req.body.emplacement,
      ],
      product_image: req.body.image,
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
