const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const authenticateUser = require("./middleware/authenticateUser");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const chatRoutes = require("./routes/chatRoutes");
const PORT = 3000;
const server = http.createServer(app);
const io = socketIo(server);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

require("./socket/socket")(io);

app.use("/sign", userRoutes);
app.use("/login", loginRoutes);
app.use("/chat", authenticateUser, chatRoutes);

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("index");
});

// app.listen(3000, () => {
//   console.log("서버가 3000 포트에서 실행 중...");
// });

app.get("/test", (req, res) => {
  res.render("test");
});

app.get("/test2", (req, res) => {
  res.render("test2");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("sendMessage", (message) => {
    console.log("Received message from client: ", message);
    socket.emit("receiveMessage", `서버로부터 응답: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const users = {};

io.on("connection", (socket) => {
  console.log("사용자 접속! ID:", socket.id);

  socket.on("setNickname", (nickname) => {
    users[socket.id] = nickname;
    console.log(`닉네임 저장 확인: ${socket.id} -> ${nickname}`);
    io.emit("userList", users);
    io.emit("systemMessage", `${nickname}님이 입장했습니다.`);
  });
  socket.on("userList", () => {
    const userList = { ...users };
    delete userList[socket.id];
    io.emit("userList", userList);
  });

  socket.on("chatMessage", (message) => {
    const sender = users[socket.id] || "익명";
    io.emit("chatMessage", { message, sender });
  });

  socket.on("directMessage", ({ targetId, message }) => {
    const sender = users[socket.id] || "익명";
    io.to(targetId).emit("directMessage", { message, sender });
    socket.emit("directMessage", { message, sender });
  });

  // 사용자가 퇴장하면 목록에서 제거
  socket.on("disconnect", () => {
    const nickname = users[socket.id] || "익명";
    delete users[socket.id];
    io.emit("userList", users);
    io.emit("systemMessage", `${nickname}님이 퇴장했습니다.`);
    console.log("사용자 퇴장:", socket.id);
  });
});

server.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
