const { Server } = require("socket.io");
const Message = require("../models/Message");

const users = {};

const initSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // user joins
    socket.on("join", (userId) => {

      users[userId] = socket.id;

      console.log("User joined:", userId);
    });


    // send message
    socket.on("sendMessage", async (data) => {

      const message = await Message.create({
        sender: data.sender,
        receiver: data.receiver,
        text: data.text
      });

      const receiverSocket = users[data.receiver];

      if (receiverSocket) {
        io.to(receiverSocket).emit("receiveMessage", message);
      }

    });


    // typing indicator
    socket.on("typing", (data) => {

      const receiverSocket = users[data.receiver];

      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", data.sender);
      }

    });


    socket.on("disconnect", () => {

      console.log("User disconnected:", socket.id);

      for (const userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
        }
      }

    });

  });

};

module.exports = { initSocket };