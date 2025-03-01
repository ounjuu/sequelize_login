const User = require("../models/user"); // User 모델 불러오기
const bcrypt = require("bcryptjs");
// 회원가입 처리
const registerUser = async (req, res) => {
  try {
    // 요청으로부터 사용자 정보 받기
    const { username, email, password } = req.body;

    // 사용자명과 이메일이 이미 존재하는지 확인
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

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 응답으로 성공 메시지 전송
    res.status(201).json({
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
  registerUser,
};
