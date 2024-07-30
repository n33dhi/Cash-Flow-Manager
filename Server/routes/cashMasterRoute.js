const express = require("express");
const router = express.Router();

const AuthController = require("../middlewares/authorize");
const { Dashboard } = require("../controllers/cashMaster");

router.get("/dashboard", AuthController(['admin']), Dashboard);

module.exports = router;