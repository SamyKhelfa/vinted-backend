const express = require("express");
const mongoose = require("mongoose");
const app = express();
const router = express.Router();
const cors = require("cors");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.use(express.json());
app.use(cors());

const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const offerRoute = require("./routes/offer");
const uploadRoute = require("./routes/upload");
const offersRoute = require("./routes/offers");

app.use("/user", signupRoute);
app.use("/user", loginRoute);
app.use(offerRoute);
app.use(uploadRoute);
app.use(offersRoute);

router.all("*", (req, res) => {
  return res.status(404).json("Not found");
});

app.listen(3000, () => {
  console.log("Server started");
});
