const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
const Url = require("./models/Url");
require("dotenv").config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/", require("./routes/urlRoutes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;

  const shortId = shortid.generate();

  await Url.create({
    longUrl,
    shortId
  });

  res.json({
    shortUrl: `${process.env.BASE_URL}/${shortId}`
  });
});
