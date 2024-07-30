const Request = require("../schema/requestSchema");
const User = require("../schema/userSchema");

const Dashboard = async(req, res) => {
    res.status(200).send("Welcome!!!")
}

module.exports = {
    Dashboard,
}