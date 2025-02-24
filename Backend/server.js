import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute.js";
import transactionRouter from "./routes/transactionRoutes.js";
import budgetRouter from "./routes/budgetRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js"

const app = express();


const port = process.env.PORT || 4000;


app.use(express.json()); 

// ALl routes
app.use("/api/user", userRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/budget", budgetRouter); 
app.use("/api/notification",notificationRouter); 


app.get("/", (req, res) => {
  res.send("API WORKING");
});


const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("Mongo URI is missing!");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1); 
  });

// server start
app.listen(port, () => console.log(`Server is running on port: ${port}`));
