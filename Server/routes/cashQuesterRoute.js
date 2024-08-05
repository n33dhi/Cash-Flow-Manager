const express = require("express");
const router = express.Router();

const { NewRequest, History, DeleteRequest } = require("../controllers/cashQuester")
const { Logout } = require("../controllers/onBoardController");
const AuthController = require("../middlewares/authorize");

router.use(AuthController(['employee']));

router.post("/newRequest", NewRequest);
router.get("/history", History);
router.delete("/history/:id", DeleteRequest); 

module.exports = router;