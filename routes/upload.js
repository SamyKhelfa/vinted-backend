const express = require("express");
const fileUpload = require("express-fileupload");
const router = express.Router();
const app = express();
const cloudinary = require("cloudinary").v2;
const isAuthenticated = require("../middlewares/isAuthenticated");

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

app.use(express.json());

router.post("/upload", isAuthenticated, fileUpload(), async (req, res) => {
  try {
    const pictureToUpload = req.files.picture;
    // On envoie une à Cloudinary un buffer converti en base64
    const result = await cloudinary.uploader.upload(
      convertToBase64(pictureToUpload)
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
