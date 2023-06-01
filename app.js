const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");

// Connexion à MongoDB
mongoose.connect("mongodb://127.0.0.1/Vinted");

// Importer les fichiers de routes
const userRoutes = require("./routes/userRoutes");
const offerRoutes = require("./routes/offerRoutes");

app.use(express.json());
// Utiliser les routes
app.use("/user", userRoutes);
app.use("/offer", offerRoutes);

const cloudinary = require("cloudinary").v2; // On n'oublie pas le `.v2` à la fin

// Données à remplacer avec les vôtres :
cloudinary.config({
  cloud_name: "dlauhrjen",
  api_key: "715517519195373",
  api_secret: "r2EXPhOFEdfszBxPE6z4Gxj5z7o",
});

// On positionne le middleware `fileUpload` dans la route `/upload`
app.post("/upload", fileUpload(), async (req, res) => {
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

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
  console.log();
});

app.listen(3000, () => {
  console.log("Server started");
});
