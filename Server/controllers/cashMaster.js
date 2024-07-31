const Request = require("../schema/requestSchema");
const User = require("../schema/userSchema");

const Dashboard = async (req, res) => {
  try {
    const request = await Request.find({});
    if (!request) return res.status(404).send("No record!");
    res.status(200).json({
        status: "Welcome!!!",
        data: request
    })
  } catch (e) {
    res.status(500).send({message: e.message});
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
    if (!id) return res.status(500).send("Request Id required")
    const updated = await Request.findByIdAndUpdate(id, req.body);
    const newOne = await Request.findById(id);
    res.status(200).json(newOne);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

module.exports = {
  Dashboard,
  AllUsers,
  DeleteUser,
  UpdateRequest,
};