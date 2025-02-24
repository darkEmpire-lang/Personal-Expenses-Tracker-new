import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
  deadline: { type: Date },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  lowSavingsThreshold: { type: Number, default: 20 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Goal", goalSchema);
