const express = require("express");
const shortid = require("shortid");
const Url = require("../models/Url");

const router = express.Router();

// Health check
router.get("/", (req, res) => {
  res.send("TinyHop API Running");
});


// CREATE SHORT URL
router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "originalUrl is required" });
    }

    const shortCode = shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      shortUrl,
      clicks: 0
    });

    console.log("Saved to DB:", newUrl);

    res.json({
      originalUrl: newUrl.originalUrl,
      shortCode: newUrl.shortCode,
      shortUrl: newUrl.shortUrl,
      clicks: newUrl.clicks
    });

  } catch (error) {
    console.error("POST /shorten error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// REDIRECT SHORT URL
router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    console.log("Incoming code:", shortCode);

    const urlDoc = await Url.findOne({ shortCode });

    console.log("DB result:", urlDoc);

    if (!urlDoc) {
      return res.status(404).send("Short URL not found");
    }

    // OPTIONAL: track clicks
    urlDoc.clicks += 1;
    await urlDoc.save();

    return res.redirect(urlDoc.originalUrl);

  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;