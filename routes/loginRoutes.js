const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateUser = require("../middleware/authenticateUser");

router.get("/main", userController.showLoginPage);
router.get("/dashboard", authenticateUser, userController.showDashboardPage);
router.get("/logout", userController.logoutUser);

router.post("/loginpost", userController.loginUser);

module.exports = router;
