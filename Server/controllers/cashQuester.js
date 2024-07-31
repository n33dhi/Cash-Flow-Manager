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

const DeleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const uId = req.user.id; 
    const user = await User.findById(uId);

    if (!user) {
      return res.status(404).send("User not found");
    }
    // console.log('User:', user);
    // console.log('User requests:', user.requests);

    const request = user.requests.find(req => req._id.toString() === id);
    if (!request) {
      return res.status(404).send("No record found or unauthorized action");
    }
    await Request.findByIdAndDelete(id);
    // delete the request in user document
    user.requests = user.requests.filter(req => req._id.toString() !== id);
    await user.save();

    res.status(200).send("Request deleted!!");
  } catch (e) {
    return res.status(500).send({ message: e.message });
  }
};

// const UpdateRequest = async(req, res) => {
//   try {
//     const { id } = req.params;
//     const uId = req.user.id; 
//     const user = await User.findById(uId);

//     const request = user.requests.find(req => req._id.toString() === id);
//     if (!request) {
//       return res.status(404).send("No record found or unauthorized action");
//     }

//     await Request.findByIdAndUpdate(id, req.body);
//     const updates = await Product.findById(id);
//     res.status(200).send("Success!").json(updates);
    
//   } catch (e) {
//     res.status(500).send({message: e.message});
//   }
// }



module.exports = {
  NewRequest,
  History,
  DeleteRequest,
  // UpdateRequest,
};
