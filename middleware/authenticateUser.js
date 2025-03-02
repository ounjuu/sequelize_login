const jwt = require("jsonwebtoken");
const { User } = require("../models"); // User 모델을 불러옵니다.

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "로그인이 필요합니다." });
  }

  try {
    // JWT 토큰을 디코딩합니다.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 디코딩된 토큰에서 userId를 찾고, 그에 해당하는 사용자 정보를 DB에서 조회
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "유효하지 않은 사용자입니다." });
    }

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = authenticateUser;
