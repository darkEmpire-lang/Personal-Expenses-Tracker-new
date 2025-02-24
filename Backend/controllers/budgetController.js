import Budget from "../models/budgetModel.js";


 const setBudget = async (req, res) => {
  try {
    const { category, limit, period } = req.body;
    const budget = new Budget({ userId: req.user.id, category, limit, period });
    await budget.save();
    res.status(201).json({ success: true, message: "Budget set successfully!", budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

 const getBudgetDetails = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id });
    res.status(200).json({ success: true, budgets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


 const deleteBudget = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Budget deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { setBudget, getBudgetDetails,deleteBudget}
