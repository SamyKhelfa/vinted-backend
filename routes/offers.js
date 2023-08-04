const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");

router.get("/offers", async (req, res) => {
  try {
    let page;
    let limit = Number(req.query.page);
    let filters = {};
    let sort = {};
    const count = await Offer.countDocuments(filters);

    if (Number(req.query.page) < 1) {
      page = 1;
    } else {
      page = Number(req.query.page);
    }

    if (req.query.title) {
      filters.product_name = new RegExp(req.query.title, "i");
    }
    if (req.query.priceMin) {
      filters.product_price = { $gte: req.query.priceMin };
    }
    if (req.query.priceMax) {
      filters.product_price = { $lte: req.query.priceMax };
    }
    if (req.query.priceMin && req.query.priceMax) {
      filters.product_price = {
        $gte: req.query.priceMin,
        $lte: req.query.priceMax,
      };
    }
    if (req.query.sort === "price-desc") {
      sort = { product_price: -1 };
    }
    if (req.query.sort === "price-asc") {
      sort = { product_price: 1 };
    }
    if (req.query.limit) {
      limit = Number(req.query.limit);
    }

    res.json(
      await Offer.find(filters)
        .sort(sort)
        .skip((page - 1) * limit) // ignorer les x résultats
        .limit(limit)
    ); // renvoyer y résultats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
