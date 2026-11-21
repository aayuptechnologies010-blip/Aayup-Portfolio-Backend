const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const authMiddleware = require("../middleware/auth");

// Public: Get all active team members & directors
router.get("/", async (req, res) => {
  try {
    const members = await Team.find({ active: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Get all members with pagination
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Team.countDocuments(query);
    const members = await Team.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: members,
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
    const member = new Team(req.body);
    await member.save();
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Admin: Update
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ success: false, message: "Member not found" });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Admin: Delete
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: "Member not found" });
    res.json({ success: true, message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
