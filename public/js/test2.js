const socket = io();

function setNickname() {
  const nickname = document.getElementById("nickname").value;
  socket.emit("setNickname", nickname);
}

function sendMessage() {
  const message = document.getElementById("messageInput").value;
  socket.emit("chatMessage", message);
}

function sendDM() {
  const message = document.getElementById("messageInput").value;
  const targetId = document.getElementById("userList").value;
  socket.emit("directMessage", { targetId, message });
}

socket.on("chatMessage", ({ message, sender }) => {
  displayMessage(`${sender}: ${message}`, "normal");
});

socket.on("directMessage", ({ message, sender }) => {
  displayMessage(`(DM) ${sender}: ${message}`, "dm");
});

function displayMessage(text, type) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", type);
  msgDiv.innerText = text;
  document.getElementById("messages").appendChild(msgDiv);
}

socket.on("userList", (users) => {
  const userList = document.getElementById("userList");
  userList.innerHTML = "";
  Object.entries(users).forEach(([id, nickname]) => {
    if (id !== socket.id) {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = nickname;
      userList.appendChild(option);
    }
  });
});
