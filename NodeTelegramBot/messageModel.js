const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chat_id: {
    type: Number,
    required: true,
  },
  forward_origin_chat_id: {
    type: Number,
    required: true,
    unique: true,
  },
  forwardedAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
