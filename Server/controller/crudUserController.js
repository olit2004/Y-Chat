
const { response } = require('express');
const User= require('../models/User')
const { getOnlineUsers } = require('../middleware/state')
const mongoose= require("mongoose")

const ChatRoom = require("../models/ChatRoom")



// helper function for  gettin g contacts stored 
const fetchContacts= async(onlineUsers, userId)=>{
  console.log("the userId is ",userId)

   const isAnyUserOnline = onlineUsers.size > 0;

 try {
  
      const user = await User.findById(userId)
      .populate(
        'contacts.contact',
        'userName name profilePicture isOnline lastSeen bio email'
      )
      .select('contacts');
      console.log( "the user is" ,user )

    if (!user) {
      throw new Error("User not found");
    }

    
    const contacts = user.contacts.map(entry =>{
      
      const contactId = String(entry.contact._id);
      let isContactOnline = false;
      if (isAnyUserOnline) {
          isContactOnline = onlineUsers.has(contactId);
      }
      
    return {
      contactId: entry.contact._id,
      chatId: entry.chatId,  
      userName: entry.contact.userName,
      name: entry.contact.name,
      profilePicture: entry.contact.profilePicture,
      isOnline:isContactOnline,
      lastSeen: entry.contact.lastSeen,
      bio: entry.contact.bio,
      email:entry.contact.email,
      tel:entry.contact.tel,

      nickname: entry.nickname,
      addedAt: entry.addedAt,
      unreadCount:entry.unreadCount,
      isGroup:false

    }});

    return{ contacts}



  } catch (error) {
    console.error('Error fetching contacts:', error);
   throw new Error('Server error') ;
  }
  
}

module.exports.updateUserProfilehandler= async (req,res)=>{


    const data =req.body;
 
    if (req.user){
    const userid= req.user.id

    try{
      const   newUser =await User.findByIdAndUpdate(userid,data,{new:true})
      if ( newUser){
        const {password,...user} = newUser.toObject();
        res.status(200).json(user);
      }else{
        res.status(400).json({mssg:"user not  Found"})
      }
         
        
     
     }catch(err){
        console.log("ERROR: some thing went wrong ",err);
        res.status(401).json({mssg:"something went wrong"})
     }
    
}

   return res.status(401).json({ message: "No token provided" })
     
}




module.exports.getContacts = async (req, res) => {
  const onlineUsers = getOnlineUsers();
 

  if (!req.user) {
      return res.status(401).json({ message: "No token provided" });
    }
    const userId  =req.user.id
    try{
      const {contacts}= await  fetchContacts(onlineUsers,userId)
      res.status(200).json(contacts)

    }catch(err){
      console.log("ERROR: couldn't fect user contacts",err.message)
      res.status(401).json({ message:err.message})
    }
  

};

module.exports.getChat = async (req, res) => {
  const userId = req.user.id;
  const onlineUsers = getOnlineUsers();

  try {
    // Fetch contacts
    const { contacts } = await fetchContacts(onlineUsers, userId);

  
const groups = await ChatRoom.find({
  isGroup: true,
  "members.user": userId
})
  .populate("lastMessage")
  .select("name members lastMessage createdAt updatedAt");

  console.log("group is ",groups)
const groupChats = groups.map(g => {
  const memberData = g.members.find(m => String(m.user) === String(userId));

  return {
    type: "group",
    chatId: g._id,
    groupId: g._id,
    name: g.name,
    membersCount: g.members.length,
    lastMessage: g.lastMessage,
    unreadCount: memberData ? memberData.unreadCount : 0,
    isGroup: true
  };
});

    
    const chat = [...contacts, ...groupChats];

    console.log("Sending chat list:", groupChats);
    return res.status(200).json(chat);

  } catch (err) {
    console.error("Error fetching chats:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.addContact = async (req, res) => {

  
  if (!req.user) {
    return res.status(401).json({ message: "No token provided" });
  }

  const { userName, nickname } = req.body;

  // Require username to search for contact
  if (!userName) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    
    const toBeAdded = await User.findOne({ userName });
    if (!toBeAdded) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (toBeAdded._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You can't add yourself as a contact" });
    }

    // Current logged-in user
    const currentUser = await User.findById(req.user.id);

    
    const exists = currentUser.contacts.find(
      c => c.contact.toString() === toBeAdded._id.toString()
    );

    if (exists) {
      return res.status(400).json({ message: "User already exists in your contact list" });
    }

    const chatRoom = await ChatRoom.getOrCreatePrivateRoom (currentUser._id,toBeAdded._id)
    const newContactEntry = {
      contact: toBeAdded._id,
      chatId: chatRoom._id,
      nickname: nickname || "",
      addedAt: new Date()
    };

    currentUser.contacts.push(newContactEntry);
    console.log(currentUser)

    await currentUser.save();
    await currentUser.populate("contacts.contact");

    const newContact = currentUser.contacts[currentUser.contacts.length - 1];


    const contactResponse = {
      ...newContact.contact.toObject(),
      addedAt: newContact.addedAt,
      nickname: newContact.nickname,
      chatId: chatRoom._id,
      contactId: newContact.contact._id
    };

    return res.status(201).json(contactResponse);
  } catch (err) {
    console.error("Error adding contact:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports.search=async (req,res)=>{
  console.log("the search controller is running")

  if (!req.user){
    return res.status(401).json({ message: "No token provided" })
  }
  try{

    const {q}=req.query
    if (!q|| q.trim()===""){
      return res.status(400).json({ mssg: "search term is required" });
    }
    console.log("query code",q)

    const allusers = await User.find()
    console.log("all users are ",allusers)
    const users = await User.find({

      $and: [
        {
          $or: [
            { userName: { $regex: q, $options: "i" } },
            { name: { $regex: q, $options: "i" } },
          ],
        },
        { _id: { $ne: req.user.id } }, 
      ],
    }).select("userName name profilePicture bio isOnline lastSeen");
    console.log("the users sent",users)
    res.status(200).json(users)

  }catch(err){
      console.error('Error searching users:', err);
      res.status(500).json({ message: 'Server error' });
  }
}
