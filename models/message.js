module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      chat_room_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "chat_rooms",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "messages",
      timestamps: false,
    }
  );

  Message.associate = (models) => {
    Message.belongsTo(models.ChatRoom, {
      foreignKey: "chat_room_id",
      as: "chatRoom",
    });
    Message.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  };

  return Message;
};
