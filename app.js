const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/users", userRoutes);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("서버가 3000 포트에서 실행 중...");
});
