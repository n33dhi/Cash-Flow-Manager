const express = require("express");
const router = express.Router();

const AuthController = require("../middlewares/authorize");
const { Dashboard, AllUsers, DeleteUser, UpdateRequest } = require("../controllers/cashMaster");
const { Logout } = require("../controllers/onBoardController");

router.use(AuthController(['admin']));

router.get("/dashboard", Dashboard);
router.get("/users", AllUsers);
router.delete("/users/:id", DeleteUser);
router.put("/requests", UpdateRequest);
router.post('/logout', Logout);


module.exports = router;