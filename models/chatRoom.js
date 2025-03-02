// models/chatRoom.js
module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define(
    "ChatRoom",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      is_group: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "chat_rooms",
      timestamps: false,
    }
  );

  // 연관 설정
  ChatRoom.associate = (models) => {
    ChatRoom.hasMany(models.Message, {
      foreignKey: "chat_room_id",
      as: "messages",
    });
    // ChatRoomUser 모델을 통해 다대다 관계를 설정
    ChatRoom.belongsToMany(models.User, {
      through: models.ChatRoomUser, // 중간 테이블 지정
      foreignKey: "chat_room_id",
      otherKey: "user_id",
      as: "users", // 별칭 설정
    });
    // ChatRoomUser와의 관계를 추가 (별칭 포함)
    ChatRoom.hasMany(models.ChatRoomUser, {
      foreignKey: "chat_room_id",
      as: "chatRoomUsers", // 별칭 설정
    });
  };

  return ChatRoom;
};
