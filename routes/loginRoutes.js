const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/main", userController.showLoginPage);
router.get("/dashboard", userController.showDashboardPage);
router.get("/logout", userController.logoutUser);

router.post("/loginpost", userController.loginUser);

module.exports = router;
