const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const showRegisterPage = (req, res) => {
  res.render("sign/register");
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });
    if (existingUser) {
      return res.status(400).json({
        message: "사용자명 또는 이메일이 이미 존재합니다.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.render("sign/registerSuccess", {
      message: "회원가입 성공!",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({
      message: "서버 오류가 발생했습니다.",
    });
  }
};

module.exports = {
  showRegisterPage,
  registerUser,
};
