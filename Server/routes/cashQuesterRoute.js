const express = require("express");
const router = express.Router();
const { NewRequest, History } = require("../controllers/cashQuester")
const AuthController = require("../middlewares/authorize");

router.post("/newRequest", AuthController(['employee']), NewRequest);
router.get("/history", AuthController(['employee']), History);

module.exports = router;