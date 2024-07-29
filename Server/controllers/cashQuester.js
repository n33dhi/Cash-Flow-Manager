const Request = require("../schema/requestSchema");
const User = require("../schema/userSchema");

const NewRequest = async (req, res) => {
  try {
    const { userId, description, amount, category, approvedBy } = req.body;
    const findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const newRequest = await Request.create({
      requester: userId,
      description,
      amount,
      category,
      approvedBy,
    });

    findUser.requests.push(newRequest._id);
    await findUser.save();

    res.status(201).json({ message: "Request created successfully", request: newRequest });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const History = async(req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const findById = await Request.find({ requester: userId }).lean();
    if (!findById) {
      return res.status(404).send("no record");
    }

    res.status(200).json(findById);
  } catch (e) {
    res.status(500).send({message: e.message});
  }
};

module.exports = {
  NewRequest,
  History
};
