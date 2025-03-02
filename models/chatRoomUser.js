module.exports = (sequelize, DataTypes) => {
  const ChatRoomUser = sequelize.define(
    "ChatRoomUser",
    {
      chat_room_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "ChatRoom", // 'ChatRoom' 테이블을 참조
          key: "id", // 참조할 칼럼
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "User", // 'User' 테이블을 참조
          key: "id", // 참조할 칼럼
        },
      },
    },
    {
      tableName: "chat_room_users",
      timestamps: false,
    }
  );

  ChatRoomUser.associate = (models) => {
    ChatRoomUser.belongsTo(models.ChatRoom, {
      foreignKey: "chat_room_id",
      as: "chatRoom",
    });

    // User와 연결 (belongsTo)
    ChatRoomUser.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return ChatRoomUser;
};
