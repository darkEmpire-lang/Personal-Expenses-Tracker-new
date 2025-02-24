import express from "express";
import { loginUser, registerUser, adminlogin, getAllUsers } from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminlogin);
userRouter.get("/users", adminAuth, getAllUsers); 

export default userRouter;
