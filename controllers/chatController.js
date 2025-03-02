const { ChatRoom, Message, User, ChatRoomUser } = require("../models");
const { Op } = require("sequelize");

// 채팅방 목록 페이지
const showChatRoomsPage = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    console.log("userId from cookies:", userId); // 쿠키에서 userId 값 확인
    const chatRooms = await ChatRoom.findAll({
      include: [
        {
          model: User,
          as: "users",
          where: { id: userId },
          required: true,
        },
      ],
    });

    res.render("chat/chatRooms", { chatRooms });
  } catch (error) {
    console.error("채팅방 목록 로딩 오류:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};

const showChatRoomPage = async (req, res) => {
  try {
    const { chatRoomId } = req.params;
    const userId = req.cookies.userId;

    const chatRoom = await ChatRoom.findOne({
      where: { id: chatRoomId },
      include: [
        {
          model: User,
          as: "users",
          where: { id: userId },
          required: true,
        },
        {
          model: Message,
          as: "messages",
          order: [["created_at", "ASC"]],
        },
      ],
    });

    if (!chatRoom) {
      return res.status(403).send("이 채팅방에 입장할 수 없습니다.");
    }
    const user = await User.findByPk(userId);
    res.render("chat/room", { chatRoom, user, messages: chatRoom.messages });
  } catch (error) {
    console.error("채팅방 페이지 로딩 오류:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};

// 메시지 보내기
const sendMessage = async (req, res) => {
  try {
    const { chatRoomId, message } = req.body;
    const userId = req.cookies.userId;

    const chatRoom = await ChatRoom.findByPk(chatRoomId);
    if (!chatRoom) {
      return res.status(404).send("채팅방을 찾을 수 없습니다.");
    }

    const newMessage = await Message.create({
      message,
      chat_room_id: chatRoomId,
      user_id: userId,
    });

    console.log("새로운 메시지:", newMessage);

    res
      .status(200)
      .json({ success: true, message: "메시지가 전송되었습니다." });
  } catch (error) {
    console.error("메시지 전송 오류:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};

// 채팅방 생성
const createChatRoom = async (req, res) => {
  try {
    if (!req.body.name || req.body.name.trim() === "") {
      return res.status(400).send("채팅방 이름을 입력하세요.");
    }

    const userId = req.user.id;

    const newChatRoom = await ChatRoom.create({
      name: req.body.name,
      is_group: req.body.is_group || 0,
    });

    await newChatRoom.addUser(userId);

    res.status(200).send({ message: "채팅방이 생성되었습니다." });
  } catch (error) {
    console.error("채팅방 생성 오류:", error);
    res.status(500).send({ message: "채팅방 생성 중 오류가 발생했습니다." });
  }
};

// 채팅방에 유저 추가
const addUserToChatRoom = async (req, res) => {
  try {
    const { chatRoomId, userId } = req.body;

    // 채팅방 및 유저 존재 여부 확인
    const chatRoom = await ChatRoom.findByPk(chatRoomId);
    const user = await User.findByPk(userId);
    if (!chatRoom || !user) {
      return res.status(404).send("채팅방이나 유저를 찾을 수 없습니다.");
    }

    // 채팅방에 유저 추가
    await chatRoom.addUser(userId);

    res
      .status(200)
      .json({ success: true, message: "유저가 채팅방에 추가되었습니다." });
  } catch (error) {
    console.error("유저 추가 오류:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};

// 채팅방 나가기
const leaveChatRoom = async (req, res) => {
  try {
    const { chatRoomId } = req.body;
    const userId = req.cookies.userId;

    // 채팅방 존재 여부 확인
    const chatRoom = await ChatRoom.findByPk(chatRoomId);
    if (!chatRoom) {
      return res.status(404).send("채팅방을 찾을 수 없습니다.");
    }

    // 유저가 채팅방에 있는지 확인하고 나가기
    await chatRoom.removeUser(userId);

    res.status(200).json({ success: true, message: "채팅방을 나갔습니다." });
  } catch (error) {
    console.error("채팅방 나가기 오류:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};

module.exports = {
  showChatRoomsPage,
  showChatRoomPage,
  sendMessage,
  createChatRoom,
  addUserToChatRoom,
  leaveChatRoom,
};
