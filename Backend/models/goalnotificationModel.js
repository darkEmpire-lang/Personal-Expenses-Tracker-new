import mongoose from "mongoose";

const goalnotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model("GoalNotification", goalnotificationSchema);
