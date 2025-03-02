const { User, ChatRoom, ChatRoomUser, Message } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

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

    // JWT 생성
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // 쿠키에 JWT 저장
    res.cookie("token", token, { httpOnly: true, secure: false });

    res.status(200).json({ success: true, message: "로그인 성공!" });
  } catch (error) {
    console.error("로그인 오류:", error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};

// 대시보드 페이지
const showDashboardPage = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.redirect("/login/main");
    }

    res.cookie("userId", req.user.id, { maxAge: 900000, httpOnly: true });
    const userId = req.user.id;

    const chatRooms = await ChatRoom.findAll({
      include: [
        {
          model: ChatRoomUser,
          as: "chatRoomUsers",
          where: { user_id: userId },
          required: true,
        },
        {
          model: User,
          as: "users",
        },
        {
          model: Message,
          as: "messages",
          order: [["created_at", "ASC"]], // 메시지를 시간순으로 정렬
          limit: 10, // 각 채팅방에서 최근 10개의 메시지만 가져오기 (필요에 따라 수정)
        },
      ],
    });

    // user 정보를 추가해서 렌더링
    res.render("login/dashboard", {
      chatRooms,
      user: req.user, // `user`를 템플릿에 전달
    });
  } catch (error) {
    console.error("채팅방 목록 조회 오류:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "로그아웃 성공!" });
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
