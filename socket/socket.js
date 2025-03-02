const { Message } = require("../models");
const ChatRoom = require("../models/chatRoom");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("새로운 사용자 연결됨:", socket.id);

    // 사용자가 채팅방에 입장
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`방 ${roomId}에 연결됨`);
    });

    // 메시지 전송
    socket.on("sendMessage", async (data) => {
      try {
        const { message, chatRoomId, userId } = data;

        console.log("메시지 데이터:", message, chatRoomId, userId); // 로그 추가

        // 메시지를 데이터베이스에 저장
        const newMessage = await Message.create({
          message,
          chat_room_id: chatRoomId, // chat_room_id로 저장
          user_id: userId, // user_id로 저장
        });

        console.log("DB에 저장된 메시지:", newMessage); // 저장된 메시지 로그

        // 해당 채팅방에 있는 모든 사용자에게 새로운 메시지를 전송
        io.to(chatRoomId).emit("newMessage", newMessage);
      } catch (error) {
        console.error("메시지 전송 실패:", error);
      }
    });

    // 연결 종료 처리
    socket.on("disconnect", () => {
      console.log("사용자 연결 끊어짐:", socket.id);
    });
  });
};
