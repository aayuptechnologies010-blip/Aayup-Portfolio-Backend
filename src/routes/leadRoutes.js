const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const authMiddleware = require("../middleware/auth");

// Public: Submit Contact Inquiry
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email and message are required." });
    }

    const lead = new Lead({ name, email, phone, service, message });
    await lead.save();

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully! Aayup team will contact you soon.",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Get all leads with pagination
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status } = req.query;
    const query = {};
    if (status && status !== "All") query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: leads,
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

// Admin: Update lead status/notes
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Admin: Delete lead
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
