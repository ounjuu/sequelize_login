const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
// 채팅방 목록 페이지 이동
router.get("/rooms", chatController.showChatRoomsPage);

// 특정 채팅방 입장 페이지 이동
router.get("/room/:chatRoomId", chatController.showChatRoomPage);

// 메시지 보내기
router.post("/message", chatController.sendMessage);

// 채팅방 생성
router.post("/createRoom", chatController.createChatRoom);

// 채팅방에 유저 추가
router.post("/addUser", chatController.addUserToChatRoom);

// 채팅방 나가기
router.post("/leaveRoom", chatController.leaveChatRoom);

module.exports = router;
