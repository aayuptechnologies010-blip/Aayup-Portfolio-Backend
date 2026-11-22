const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/auth");

// Use Memory Storage so file is buffered in RAM and converted to base64
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg/;
    const mime = allowed.test(file.mimetype);
    if (mime) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (.jpg, .png, .webp, .svg) are allowed."));
    }
  },
});

router.post("/", authMiddleware, upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // Convert Buffer directly to base64 Data URI
    const mimeType = req.file.mimetype;
    const base64Data = req.file.buffer.toString("base64");
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    res.json({
      success: true,
      url: dataUri,
      message: "Image successfully encoded to Base64!",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
