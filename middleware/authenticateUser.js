const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "로그인이 필요합니다." });
  }

  try {
    // JWT 토큰을 디코딩합니다.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 디코딩된 토큰에서 userId를 찾을 수 있도록
    req.userId = decoded.id; // userId가 아닌 id로 수정

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = authenticateUser;
