import Goal from "../models/goalModel.js";
import Notification from "../models/goalnotificationModel.js";
import moment from "moment";


export const checkLowSavings = async (goal) => {
    const thresholdAmount = (goal.targetAmount * goal.lowSavingsThreshold) / 100;
    if (goal.savedAmount < thresholdAmount) {
      const message = `Your savings for "${goal.name}" are below ${goal.lowSavingsThreshold}% of the target. Consider saving more!`;
      
      
      const notification = new Notification({
        userId:req.user.id,
        message: message,
        
      });
      
     
      await notification.save();
    }
  };
  

// Create a Goal
export const createGoal = async (req, res) => {
  try {
    const { name, targetAmount, savedAmount, deadline, priority, lowSavingsThreshold } = req.body;
    const newGoal = new Goal({
      userId: req.user.id,
      name,
      targetAmount,
      savedAmount: savedAmount || 0,
      deadline,
      priority: priority || "Medium",
      lowSavingsThreshold: lowSavingsThreshold || 20,
    });
    await newGoal.save();
    res.status(201).json({ success: true, message: "Goal created successfully!", goal: newGoal });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating goal", error: error.message });
  }
};

// Get All Goals for a User
export const getUserGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, goals });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching goals", error: error.message });
  }
};

// Update a Goal
export const updateGoal = async (req, res) => {
  try {
    const { savedAmount, name, targetAmount, deadline, priority, lowSavingsThreshold } = req.body;
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ success: false, message: "Goal not found" });

    if (name) goal.name = name;
    if (targetAmount) goal.targetAmount = targetAmount;
    if (deadline) goal.deadline = deadline;
    if (priority) goal.priority = priority;
    if (lowSavingsThreshold) goal.lowSavingsThreshold = lowSavingsThreshold;
    if (savedAmount) goal.savedAmount += savedAmount;

    await goal.save();
    await checkLowSavings(goal);

    res.status(200).json({ success: true, message: "Goal updated successfully!", goal });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating goal", error: error.message });
  }
};

// Delete a Goal
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ success: false, message: "Goal not found" });
    await goal.deleteOne();
    res.status(200).json({ success: true, message: "Goal deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting goal", error: error.message });
  }
};

// Get all Notifications for a User
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching notifications", error: error.message });
  }
};

// Get Goal Details (Remaining time and amount to save)
export const getGoalDetails = async (req, res) => {
    try {
      const goalId = req.params.id; // Get the goal ID from the URL parameter
      const goal = await Goal.findById(goalId);
      
      if (!goal) {
        return res.status(404).json({ success: false, message: "Goal not found" });
      }
  
      // Calculate remaining time
      const currentDate = moment();
      const deadline = moment(goal.deadline);
      const timeRemaining = deadline.diff(currentDate, "days");
  
      // Calculate the remaining amount
      const remainingAmount = goal.targetAmount - goal.savedAmount;
  
      // Emit real-time notification if needed
      if (remainingAmount < goal.targetAmount * (goal.lowSavingsThreshold / 100)) {
        await checkLowSavings(goal);
      }
  
      
      res.status(200).json({
        success: true,
        goal: {
          name: goal.name,
          targetAmount: goal.targetAmount,
          savedAmount: goal.savedAmount,
          timeRemaining: `${timeRemaining} days`,  // Append "days"
          remainingAmount: remainingAmount > 0 ? remainingAmount : 0,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching goal details", error: error.message });
    }
  };
