const express = require("express");
const router = express.Router();

const { RegisterUser, Login, ForgetPassword, RefreshToken, Logout } = require("../controllers/onBoardController");

router.post("/register", RegisterUser);
router.post("/login", Login);
router.post("/forgetPassword", ForgetPassword);
router.post("/refreshToken", RefreshToken);
router.post("/logout", Logout);

module.exports = router;