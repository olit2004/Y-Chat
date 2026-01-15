const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
  name: { type: String, required: function() { return this.isGroup; } },
  isGroup: { type: Boolean, default: false },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isAdmin: { type: Boolean, default: false },
    unreadCount: { type: Number, default: 0 }
  }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

ChatRoomSchema.statics.getOrCreatePrivateRoom = async function (userA, userB) {
  
  let room = await this.findOne({
    isGroup: false,
    "members.user": { $all: [userA, userB] },
    $expr: { $eq: [ { $size: "$members" }, 2 ] }
  });

  if (room) return room;

  
  room = await this.create({
    isGroup: false,
    members: [
      { user: userA, isAdmin: false, unreadCount: 0 },
      { user: userB, isAdmin: false, unreadCount: 0 }
    ],
    owner: null 
  });

  return room;
};


ChatRoomSchema.statics.getOrCreateGroupChat = async function ({ name, members, admins = [], owner }) {
  try {
   
    const memberObjects = members.map(m => ({
      user: m,
      isAdmin: admins.includes(m),
      unreadCount: 0
    }));

    let room = await this.findOne({
      name,
      isGroup: true,
      owner,
      "members.user": { $all: members }
    });

    if (room) return room;

    room = await this.create({
      name,
      isGroup: true,
      members: memberObjects,
      owner
    });

    return room;
  } catch (err) {
    console.error("ERROR: error occurred while creating the group chat", err);
    throw err;
  }
};


const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
 module.exports = ChatRoom;
