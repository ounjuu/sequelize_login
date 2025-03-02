const socket = io();

document.getElementById("button1").addEventListener("click", () => {
  socket.emit("sendMessage", "버튼 1을 눌렀습니다!");
});

document.getElementById("button2").addEventListener("click", () => {
  socket.emit("sendMessage", "버튼 2를 눌렀습니다!");
});

document.getElementById("button3").addEventListener("click", () => {
  socket.emit("sendMessage", "버튼 3을 눌렀습니다!");
});

socket.on("receiveMessage", (message) => {
  document.getElementById("response").innerText = message;
});
