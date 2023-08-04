const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post(
  "/offer/publish",
  fileUpload(),
  isAuthenticated,
  async (req, res) => {
    try {
      console.log("/offer/publish");
      const { title, description, price, brand, size, condition, color, city } =
        req.body;

      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          { MARQUE: brand },
          { TAILLE: size },
          { ÉTAT: condition },
          { COULEUR: color },
          { EMPLACEMENT: city },
        ],
        owner: req.user,
      });
      console.log(req.body);
      await newOffer.save();

      res.json(newOffer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
