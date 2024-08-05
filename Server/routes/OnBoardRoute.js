const express = require("express");
const router = express.Router();

const { RegisterUser, Login, ForgetPassword, RefreshToken } = require("../controllers/onBoardController");

router.post("/register", RegisterUser);
router.post("/login", Login);
router.post("/forgetPassword", ForgetPassword);
router.post("/refreshToken", RefreshToken);

module.exports = router;