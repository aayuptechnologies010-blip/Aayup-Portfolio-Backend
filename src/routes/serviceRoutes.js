const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const authMiddleware = require("../middleware/auth");

// Public
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: All with pagination
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: "i" };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Service.countDocuments(query);
    const services = await Service.find(query).sort({ order: 1 }).skip(skip).limit(parseInt(limit));

    res.json({
      success: true,
      data: services,
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
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Admin: Update
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Admin: Delete
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
