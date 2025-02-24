import express from "express";
import { createGoal, getUserGoals, updateGoal, deleteGoal, getNotifications, getGoalDetails } from "../controllers/goalController.js";
import authUser from "../middleware/auth.js";
const router = express.Router();

// Route to create a new goal
router.post("/set",authUser, createGoal);

// Route to get all goals for a user
router.get("/get",authUser, getUserGoals);

// Route to update a specific goal
router.put("/:id",authUser, updateGoal);

// Route to delete a specific goal
router.delete("/:id",authUser, deleteGoal);

// Route to get all notifications for a user
router.get("/notifications",authUser, getNotifications);

// Route to get a specific goal's details (including time remaining and amount to save)
router.get("/:id/details",authUser, getGoalDetails);

export default router;
