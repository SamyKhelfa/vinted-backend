const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Connexion à MongoDB
mongoose.connect("mongodb://127.0.0.1/Vinted");

// Importer les fichiers de routes
const userRoutes = require("./routes/userRoutes");
const offerRoutes = require("./routes/offerRoutes");

app.use(express.json());
// Utiliser les routes
app.use("/user", userRoutes);
app.use("/offer", offerRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "This route does not exist" });
  console.log();
});

app.listen(3000, () => {
  console.log("Server started");
});
