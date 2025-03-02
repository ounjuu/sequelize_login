document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const chatRoomId = "<%= Number(chatRoom.id) %>";
  const userId = "<%= Number(user.id) %>";

  socket.emit("joinRoom", chatRoomId);

  function sendMessage() {
    const message = document.querySelector("#message").value;
    if (message.trim() !== "") {
      socket.emit("sendMessage", {
        message,
        chatRoomId: chatRoomId,
        userId: userId,
      });
      document.querySelector("#message").value = "";
    }
  }

  document.querySelector("#sendBtn").addEventListener("click", sendMessage);

  socket.on("newMessage", (data) => {
    const messageElement = document.createElement("li");
    messageElement.textContent = `${data.userId}: ${data.message}`;
    document.querySelector("#messages").appendChild(messageElement);
  });
});
