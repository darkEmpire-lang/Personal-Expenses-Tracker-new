import express from "express";
import { getUserNotifications, deleteNotification,getAllNotifications, getNotificationById} from "../controllers/notificationController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const router = express.Router();
router.get("/get", authUser, getUserNotifications);
router.delete("/:id", authUser, deleteNotification);
router.get("/getall",adminAuth,getAllNotifications);
router.get("/:id", adminAuth, getNotificationById);

export default router;
