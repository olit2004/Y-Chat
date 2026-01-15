const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: String,
  size: Number, 
  type: String  // MIME type (e.g., 'image/png', 'application/pdf')
}, { _id: false });

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'video'],
    default: 'text'
  },
  seenBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  attachments: [attachmentSchema]
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;