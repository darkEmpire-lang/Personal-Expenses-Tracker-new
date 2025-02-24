import express from "express";
import { setBudget, getBudgetDetails, deleteBudget } from "../controllers/budgetController.js";
import authUser from "../middleware/auth.js";

const router = express.Router();


router.post("/set",authUser, setBudget);
router.get("/get",authUser, getBudgetDetails);
router.delete("/:id",authUser, deleteBudget);

export default router;
