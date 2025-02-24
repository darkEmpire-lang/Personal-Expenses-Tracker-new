import Transaction from "../models/transactionModel.js";
import Budget from "../models/budgetModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";


 const addTransaction = async (req, res) => {
  try {
    const { amount, type, category, tags, recurring, recurrencePattern, date } = req.body;
    if (!amount || !type || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields!" });
    }

    
    const transaction = new Transaction({
      userId: req.user.id,
      amount,
      type,
      category,
      tags,
      recurring,
      recurrencePattern,
      date: date || new Date(),
    });
    await transaction.save();

   
    if (type === "expense") {
      
      const budget = await Budget.findOne({ userId: req.user.id, category });
      if (budget) {
       
        const newTotalSpent = (budget.totalSpent || 0) + amount;
       
        budget.totalSpent = newTotalSpent;
        budget.balance = budget.limit - newTotalSpent;
        await budget.save();

        
        if (newTotalSpent > budget.limit) {
          const balanceAfterSpending = budget.limit - newTotalSpent; 
         
          const user = await User.findById(req.user.id);
          const notificationMessage = `Warining!!! ${user.name}, you exceeded your ${category} budget! Limit: $${budget.limit}, Spent: $${newTotalSpent}, Balance: $${balanceAfterSpending}`;
          
          
          const notification = new Notification({
            userId: req.user.id,
            category,
            message: notificationMessage,
            limit: budget.limit,
            totalSpent: newTotalSpent,
            balanceAfterSpending
          });
          await notification.save();
        }
      }
    }

    res.status(201).json({ success: true, message: "Transaction added successfully!", transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding transaction", error: error.message });
  }
};


 const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .populate("userId", "name email");
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching transactions", error: error.message });
  }
};


 const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    res.json({ success: true, message: "Your Expenses deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting transaction", error: error.message });
  }
};


 const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json({ success: true, message: "Your Expenses Updated Successfully", transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating transaction", error: error.message });
  }
};

export {addTransaction,getUserTransactions,deleteTransaction,updateTransaction}