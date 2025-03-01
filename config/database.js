const { Sequelize } = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("✅ DB 연결 성공"))
  .catch((err) => console.error("❌ DB 연결 실패:", err));

module.exports = { sequelize };
