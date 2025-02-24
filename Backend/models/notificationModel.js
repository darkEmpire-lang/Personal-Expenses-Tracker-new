import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  message: { type: String, required: true },
  limit: { type: Number, required: true },
  totalSpent: { type: Number, required: true },
  balanceAfterSpending: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
