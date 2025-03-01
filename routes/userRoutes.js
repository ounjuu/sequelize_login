const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// 회원가입 페이지 이동
router.get("/register", userController.showRegisterPage);
router.post("/registerSuccess", userController.registerUser);

module.exports = router;
