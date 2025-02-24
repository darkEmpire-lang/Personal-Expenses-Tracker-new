import express from "express";
import Notification from "../models/notificationModel.js";
import authuser from "../middleware/auth.js";

const router = express.Router();

// Get all notifications for a user
router.get("/", authuser, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notifications", error: error.message });
  }
});

// Mark a notification as read
router.put("/:id", authuser, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating notification", error: error.message });
  }
});

export default router;
