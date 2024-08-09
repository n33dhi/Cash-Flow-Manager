const express = require("express");
const router = express.Router();

const AuthController = require("../middlewares/authorize");
const { Dashboard, AllUsers, SingleUser, DeleteUser, UpdateRequest, GetClaims } = require("../controllers/cashMaster");

router.use(AuthController(['admin']));

router.get("/dashboard", Dashboard);
router.get("/users", AllUsers);
router.get("/user/:id", SingleUser)
router.get("/claims/:id", GetClaims);
router.delete("/user/:id", DeleteUser);
router.put("/requests", UpdateRequest);


module.exports = router;