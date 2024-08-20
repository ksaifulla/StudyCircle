const express = require("express");
const router = express.Router();
const { StudyGroup, Schedule } = require("../db");
const authMiddleware = require("../middleware/auth");

// Create a new study group
router.post("/", authMiddleware, async (req, res) => {
  const { name, subject, description } = req.body;
  try {
    const group = new StudyGroup({
      name,
      subject,
      description,
      members: [req.user.id],
      admins: [req.user.id],
    });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Join a study group
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: "Already a member" });
    }

    group.members.push(req.user.id);
    await group.save();
    res.status(200).json({ message: "Joined group successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all study groups
router.get("/", authMiddleware, async (req, res) => {
  try {
    const groups = await StudyGroup.find().populate("members", "username");
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get study group by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const group = await StudyGroup.findById(req.params.id).populate(
      "members",
      "username"
    );
    if (!group) return res.status(404).json({ message: "Group not found" });

    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:groupId/schedules", authMiddleware, async (req, res) => {
  const { title, description, deadline } = req.body;
  try {
    const schedule = new Schedule({
      group: req.params.groupId,
      title,
      description,
      deadline,
    });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all schedules for a group
router.get("/:groupId/schedules", authMiddleware, async (req, res) => {
  try {
    const schedules = await Schedule.find({ group: req.params.groupId });
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
