const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// 회원가입 페이지
const showRegisterPage = (req, res) => {
  res.render("sign/register");
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 사용자명 또는 이메일로 기존 사용자 검색
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    // 이미 존재하는 사용자명 또는 이메일이 있으면 에러 응답
    if (existingUser) {
      return res.status(400).send("사용자명 또는 이메일이 이미 존재합니다.");
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새로운 사용자 생성
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      created_at: new Date(),
    });

    req.session.userId = newUser.id;

    // 회원가입 성공 페이지 렌더링
    res.status(200).json({ message: "회원가입 성공!" });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};
const showRegisterSuccessPage = (req, res) => {
  console.log("세션에 저장된 사용자 ID 확인:", req.session.userId);

  if (!req.session.userId) {
    return res.status(401).send("로그인이 필요합니다.");
  }

  User.findOne({ where: { id: req.session.userId } })
    .then((user) => {
      if (user) {
        res.render("sign/registerSuccess", {
          message: "회원가입 성공!",
          user: user,
        });
      } else {
        res.status(404).send("사용자를 찾을 수 없습니다.");
      }
    })
    .catch((error) => {
      console.error("회원가입 성공 페이지 로딩 오류:", error);
      res.status(500).send("서버 오류가 발생했습니다.");
    });
};

// 로그인 페이지
const showLoginPage = (req, res) => {
  res.render("login/main");
};

// db 찾기
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "이메일 또는 비밀번호가 틀렸습니다.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "이메일 또는 비밀번호가 틀렸습니다.",
      });
    }
    req.session.userId = user.id;
    res.status(200).json({ success: true, message: "로그인 성공!" });
  } catch (error) {
    console.error("로그인 오류:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};

// 세션에 사용자 ID가 없으면 로그인 페이지로 리디렉션
const showDashboardPage = (req, res) => {
  if (!req.session.userId) {
    return res.redirect("login/main");
  }

  User.findOne({ where: { id: req.session.userId } })
    .then((user) => {
      if (user) {
        res.render("login/dashboard", { user });
      } else {
        res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }
    })
    .catch((error) => {
      console.error("대시보드 페이지 로딩 오류:", error);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    });
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "로그아웃 오류가 발생했습니다." });
    }
    res.redirect("login/main");
  });
};

module.exports = {
  showRegisterPage,
  registerUser,
  showLoginPage,
  showRegisterSuccessPage,
  loginUser,
  showDashboardPage,
  logoutUser,
};
