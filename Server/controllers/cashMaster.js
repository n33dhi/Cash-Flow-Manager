const Request = require("../schema/requestSchema");
const User = require("../schema/userSchema");
const Budget = require("../schema/budgetSchema");

const Dashboard = async (req, res) => {
  try {
    const request = await Request.find({});
    if (!request) return res.status(404).send("No record!");
    res.status(200).json({
      status: "Welcome!!!",
      data: request,
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const NewRequest = async (req, res) => {
  try {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const newRequests = await Request.find({
      createdAt: { $gte: threeDaysAgo },
    });
    res.status(200).json(newRequests);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const AllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json({ status: "Success", data: allUsers });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const SingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userDetail = await User.findById(id);
    res.status(200).json({ status: "Success", data: userDetail });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User Deleted!" });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const UpdateRequest = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(500).send("Request Id required");
    const updated = await Request.findByIdAndUpdate(id, req.body);
    const newOne = await Request.findById(id);
    res.status(200).json(newOne);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const GetClaims = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const findById = await Request.find({ requester: id }).lean();
    if (!findById) {
      return res.status(404).send("no record");
    }

    res.status(200).json(findById);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};



//Budget
const SetBudget = async (req, res) => {
  const { amount } = req.body;
  try {
    if (amount < 0) {
      return res.status(400).json({ error: "Amount cannot be negative" });
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
    const currentYear = now.getFullYear();

    let budget = await Budget.findOne({ month: currentMonth, year: currentYear });

    // Calculate amount spent so far this month
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0);

    const acceptedRequests = await Request.find({
      status: "Accepted",
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const amountSpentThisMonth = acceptedRequests.reduce(
      (acc, req) => acc + req.amount,
      0
    );

    const remainingAmount = amount;

    // Check if a budget for the current month already exists
    if (budget) {
      if (budget.budgetSet) {
        if (amount >= 1000 || now.getDate() !== 1) {
          return res.status(403).json({
            error: "Budget can only be set on the first of the month or if below ₹1000",
          });
        }
      }

      budget.amount = amount;
      budget.initialAmount = amount;
      budget.remainingAmount = remainingAmount;
      budget.budgetSet = true;
      await budget.save();
    } else {
      budget = new Budget({
        amount,
        initialAmount: amount,
        remainingAmount,
        budgetSet: true,
        month: currentMonth,
        year: currentYear,
      });
      await budget.save();
    }

    res.status(200).json({ message: "Budget updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const UpdateBudget = async (req, res) => {
  const { id } = req.params;
  try {
    const budget = await Budget.findById(id);
    if (!budget) return res.status(404).json({ error: "Budget not found" });

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 0);

    const acceptedRequests = await Request.find({
      status: "Accepted",
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const amountSpentThisMonth = acceptedRequests.reduce(
      (acc, req) => acc + req.amount,
      0
    );

    budget.remainingAmount = budget.amount - amountSpentThisMonth;
    await budget.save();

    res.status(200).json({ message: "Budget updated successfully", remainingAmount: budget.remainingAmount });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const GetBudget = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; 
    const currentYear = now.getFullYear();

    const budget = await Budget.findOne({ month: currentMonth, year: currentYear });
    if (!budget) return res.status(404).json({ error: "Budget not found" });

    const remainingAmount = budget.remainingAmount;

    res.status(200).json({
      budget: budget.amount,
      remainingAmount,
      budgetSet: budget.budgetSet,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const GetBudgetId = async (req, res) => {
  const { month, year } = req.body;

  if (!month || !year) {
    return res.status(400).json({ error: 'Month and year are required' });
  }

  try {
    const monthNumber = parseInt(month, 10);
    const yearNumber = parseInt(year, 10);

    if (isNaN(monthNumber) || isNaN(yearNumber) || monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({ error: 'Invalid month or year' });
    }

    const budget = await Budget.findOne({ month: monthNumber, year: yearNumber });
    
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found for the specified month and year' });
    }

    res.status(200).json(budget);
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ error: 'Server error' });
  }
}


module.exports = {
  Dashboard,
  AllUsers,
  SingleUser,
  DeleteUser,
  UpdateRequest,
  GetClaims,
  NewRequest,
  SetBudget,
  UpdateBudget,
  GetBudget,
  GetBudgetId
};
