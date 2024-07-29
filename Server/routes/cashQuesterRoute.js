const express = require("express");
const router = express.Router();
const { NewRequest, History } = require("../controllers/cashQuester")

router.post("/newRequest", NewRequest);
router.get("/history", History);

module.exports = router;