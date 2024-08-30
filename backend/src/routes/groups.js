const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { StudyGroup, Schedule, Message, Note } = require("../db");
const authMiddleware = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

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

// Get all study groups created or joined by a user

router.get("/", authMiddleware, async (req, res) => {
  try {
    const groups = await StudyGroup.find({ members: req.user.id }).populate(
      "members",
      "username"
    );

    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get study group by ID

router.get("/:id", authMiddleware, async (req, res) => {
  const { id: groupId } = req.params;
  const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ message: "Invalid group ID format." });
  }

  try {
    const isMember = await StudyGroup.findById(groupId);
    if (!isMember || !isMember.members.includes(userId)) {
      return res.status(403).json({
        message: "You are not authorized to view messages in this group.",
      });
    }
    const group = await StudyGroup.findById(groupId).populate(
      "members",
      "username"
    );

    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  "/:groupId/schedules",
  authMiddleware,
  isAdmin,
  async (req, res) => {
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
  }
);

// Get all schedules for a group
router.get("/:groupId/schedules", authMiddleware, async (req, res) => {
  try {
    const schedules = await Schedule.find({ group: req.params.groupId });
    res.status(200).json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:groupId/messages", authMiddleware, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ message: "Invalid group ID format." });
  }

  try {
    const group = await StudyGroup.findById(groupId);

    if (!group || !group.members.includes(userId)) {
      return res.status(403).json({
        message: "You are not authorized to view messages in this group.",
      });
    }

    const messages = await Message.find({ group: groupId }).populate(
      "sender",
      "username"
    );
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new note
router.post("/:groupId/notes", authMiddleware, async (req, res) => {
  const { title, content, isCollaborative } = req.body;
  try {
    const note = new Note({
      group: req.params.groupId,
      author: req.user.id,
      title,
      content,
      isCollaborative,
      editors: isCollaborative ? [req.user.id] : [],
    });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all notes for a group
router.get("/:groupId/notes", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ group: req.params.groupId }).populate(
      "author",
      "username"
    );
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a note (for collaborative editing)
router.put("/notes/:id", authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.isCollaborative && !note.editors.includes(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to edit this note" });
    }

    note.content = content;
    note.updatedAt = Date.now();
    await note.save();
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific note by ID
router.get("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
