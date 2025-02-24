import express from "express";
import { addTransaction, getUserTransactions, deleteTransaction, updateTransaction } from "../controllers/transactionController.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

router.post("/add", authUser, addTransaction);
router.get("/", authUser, getUserTransactions);
router.delete("/:id", authUser, deleteTransaction);
router.put("/:id", authUser, updateTransaction);

export default router;
