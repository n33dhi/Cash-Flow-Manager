const express = require("express");
const router = express.Router();

const { RegisterUser, Login, ForgetPassword } = require("../controllers/onBoardController");

router.post("/register", RegisterUser);
router.post("/login", Login);
router.post("/forgetPassword", ForgetPassword);

module.exports = router;