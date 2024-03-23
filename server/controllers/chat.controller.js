const httpStatus = require("http-status");
const Chat = require("../models/message.model");
const { roles } = require("../config/roles");

const SendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    // Check if sender and receiver are User or VenueOwner
    if (
      ![roles.User, roles.VenueOwner].includes(sender.role) ||
      ![roles.User, roles.VenueOwner].includes(receiver.role)
    ) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send({ error: "Chats are only between users and venue owners." });
    }

    const chat = new Chat({ sender, receiver, message });
    await chat.save();

    // Emit to socket rooms of the sender and receiver
    io.to(sender._id.toString())
      .to(receiver._id.toString())
      .emit("message", chat);

    res.status(httpStatus.CREATED).send(chat);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

const GetMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    // Check if sender and receiver are User or VenueOwner
    if (
      ![roles.User, roles.VenueOwner].includes(sender.role) ||
      ![roles.User, roles.VenueOwner].includes(receiver.role)
    ) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send({ error: "Chats are only between users and venue owners" });
    }

    const messages = await Chat.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    });
    res.status(httpStatus.OK).send(messages);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.message);
  }
};

module.exports = {
  SendMessage,
  GetMessages,
};
