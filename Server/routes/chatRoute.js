
const express= require("express")
const route = express.Router()
const requireAuth= require('../middleware/requireAuth')
const ChatRoom =require("../models/ChatRoom")
const User = require ('../models/User')
route.get('/privatechat', requireAuth, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "No Authorized" });
  }

  const { userId } = req.query;
  const myId = req.user.id;

  
  let room = await ChatRoom.findOne({
    isGroup: false,
    "members.user": { $all: [myId, userId] },
    $expr: { $eq: [ { $size: "$members" }, 2 ] }
  });

  if (!room) {
    room = await ChatRoom.create({
      isGroup: false,
      members: [
        { user: myId, isAdmin: false, unreadCount: 0 },
        { user: userId, isAdmin: false, unreadCount: 0 }
      ]
    });
  }

  res.json({
    chatRoomId: room._id,
    userId
  });
});

route.post ('/create-group',requireAuth,async (req,res)=>{
  if (!req.user){
  return res.status(401).json({ message: "No token provided" })

  }


  const { name, members = [], admins = [] } = req.body;
  const owner = req.user.id;


  const updatedMembers = [...new Set([...members, owner])];

  try {
    console.log("11111")

    const room = await ChatRoom.getOrCreateGroupChat({name,members:updatedMembers,admins,owner})
    console.log("2222")
    res.status(200).json({room,owner})
  }catch (err){
    console.log("33333")

    console.log("ERROR : while creating the group",err);
    res.status(500).json(err)
  }




})



route.get('/contact-by-chat', requireAuth, async (req, res) => {

  if (!req.user) {
    return res.status(401).json({ message: "No token provided" });
  }

  const { chatId } = req.query;
  const myId = req.user.id;

  try {
    const chatRoom = await ChatRoom.findById(chatId)
      .populate('members.user', 'userName name profilePicture isOnline lastSeen bio email')
      .populate('owner', 'userName name profilePicture');

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    if (!chatRoom.isGroup) {
      
      const toMember = chatRoom.members.find(m => m.user._id.toString() !== myId.toString());

      if (!toMember) {
        return res.status(404).json({ message: "Other member not found" });
      }

      const contact = {
        contactId: toMember.user._id,
        chatId: chatRoom._id,
        userName: toMember.user.userName,
        email: toMember.user.email,
        name: toMember.user.name,
        profilePicture: toMember.user.profilePicture,
        isOnline: toMember.user.isOnline,
        lastSeen: toMember.user.lastSeen,
        bio: toMember.user.bio,
       
      };

      return res.json({ type: "private", contact });
    } else {
      
      const groupInfo = {
        chatId: chatRoom._id,
        name: chatRoom.name,
        owner: chatRoom.owner,
        members: chatRoom.members.map(m => ({
          userId: m.user._id,
          userName: m.user.userName,
          name: m.user.name,
          profilePicture: m.user.profilePicture,
          isOnline: m.user.isOnline,
          lastSeen: m.user.lastSeen,
          bio: m.user.bio,
          isAdmin: m.isAdmin,
          unreadCount: m.unreadCount
        })),
        lastMessage: chatRoom.lastMessage
      };

      return res.json({ type: "group", group: groupInfo });
    }
  } catch (err) {
    console.error("ERROR: error finding chat room", err);
    res.status(500).json({ message: "Server error" });
  }
});



route.post("/group/addMember",requireAuth, async(req,res)=>{
  if (!req.user){
    res.status(400).json({mssg:"no token provided"})
    
  }
  const { chatId, userName } = req.body;
  if (!chatId||!userName){
    res.status(400).json({mssg :"chatId and user name required"})
  }
  try{

      const group =  await  ChatRoom.findOne ({_id:chatId,isGroup:true}).populate("members.user")
      if (!group) {
          return res.status(404).json({ error: 'Group not found' });
        }

        // check if the requesting user is in the group and has priviledge to  add members
     const user  =  group.members.find(m=>m.user._id.toString()===req.user.id)
       if (!user||!user.isAdmin){
          return res.status(404).json({ error: 'only memebr and admin can add' });

       }

       //find the user to be added 

      const toBeAddedMember = await User.findOne ({userName})
      if (!toBeAddedMember){
             return res.status(404).json({ error: 'User not found' });
       }
       
       // check if  the user is already a user
       const alreadyMember = group.members.find(m=>m.user._id.toString()===toBeAddedMember._id.toString())
        if (alreadyMember) {
            return res.status(400).json({ error: 'User is already a member' });
        }
        // add the member 
        group.members.push({
          user:toBeAddedMember._id,
          isAdmin:false,
          unreadCount:0
        })
        await  group.save()
        return res.status(200).json({ message: 'Member added successfully', group });

  }catch(err){
    console.error("ERROR: couldn't add member",err)
    return res.status(500).json({error:"internal server error"})
  }
})


module.exports=route

