const { StudyGroup } = require("../db");

// Middleware to check if the user is an admin of the group
const isAdmin = async (req, res, next) => {
  const groupId = req.params.groupId;
  const userId = req.user.id;

  try {
    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const isAdmin = group.admins.includes(userId);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admins can perform this action" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = isAdmin;
