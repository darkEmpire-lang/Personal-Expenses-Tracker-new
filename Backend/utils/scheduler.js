import cron from "node-cron";
import Goal from "../models/goalModel.js";
import Notification from "../models/notificationModel.js";

const sendAutomaticAlerts = async () => {
  const goals = await Goal.find();

  for (const goal of goals) {
    const thresholdAmount = (goal.targetAmount * goal.lowSavingsThreshold) / 100;
    
    if (goal.savedAmount < thresholdAmount) {
      await Notification.create({
        userId: goal.userId,
        message: `Reminder: Your savings for "${goal.name}" are still below ${goal.lowSavingsThreshold}%. Keep saving!`,
      });
    }
  }
};

// Schedule to run every 24 hours
cron.schedule("0 0 * * *", () => {
  console.log("Checking goals for low savings...");
  sendAutomaticAlerts();
});

export default sendAutomaticAlerts;
