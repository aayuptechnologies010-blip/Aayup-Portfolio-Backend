const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");
const authMiddleware = require("../middleware/auth");

// Public
router.get("/", async (req, res) => {
  try {
    const list = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin with pagination
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Testimonial.countDocuments(query);
    const list = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: list,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Create
router.post("/", authMiddleware, async (req, res) => {
  try {
    const item = new Testimonial(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Admin: Update
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Testimonial not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Admin: Delete
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Testimonial not found" });
    res.json({ success: true, message: "Testimonial deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
