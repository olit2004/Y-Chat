const express = require('express');
const mongoose = require('mongoose');
const cookieParser= require ('cookie-parser')
const cors =require("cors");
const path = require("path")
const requireAuth =require('./middleware/requireAuth')
require('dotenv').config();
const User = require ('./models/User')
const Message = require('./models/Message')
const ChatRoom = require("./models/ChatRoom")
const { getOnlineUsers } = require("./middleware/state")

const authRoute = require('./routes/authRoute')
const crudRoute = require('./routes/crudRoute') 
const chatRoute =require('./routes/chatRoute')



const http =require('http');
const {Server}= require('socket.io');



// logic of  room based chat and group chat cone[ts should be added tommoreow ]

// enviroment variables 
const PORT = process.env.PORT || 5000;
const URI = process.env.DB_URI



const app= express();
const server=http.createServer(app);
const io = new Server(server,{cors:{
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],
    credentials:true,

}})







// io.use(requireAuth)

const onlineUsers = getOnlineUsers();


// connects user to the the socket
 io.on("connect",(socket)=>{
    console.log('socket connected:', socket.id);
    socket.on("join-user",(userId)=>{
        
        if(!userId) return ;
        console.log("user with user i d is trying to join ",)
        socket.join(`user_${userId}`)

        onlineUsers.set(userId,socket.id)
        console.log(onlineUsers)

        io.emit("user-online", userId); 
    })


    socket.on('join-chat', async (chatId,userId)=>{ 

        if (!chatId) return;
        try {
          chat= await ChatRoom.findById(chatId)
          if (!chat){
            throw new Error( " there is no such chat room") 
          }
          socket.join(`chat_${chatId}`)

          if (chat.isGroup){
            await ChatRoom.updateOne(
              {_id:chatId,'members.user':userId},
            {$set:{'members.$.unreadCount':0}})

          }else{
            await User.updateOne(
               { _id: userId, 'contacts.chatId': chatId },
               { $set: { 'contacts.$.unreadCount': 0 } })
          }
        }catch (err){
          console.log("Error: couldn't  join th echat room")
        }
            
    })
    socket.on('leave-chat', (chatId) => {
        if (!chatId) return
        socket.leave(`chat_${chatId}`)
        
    })





socket.on("send-message", async (payload) => {
  const { chatId, senderId, content } = payload;
  if (!chatId || !senderId || !content) return;

  try {

    const chat = await ChatRoom.findById(chatId);
    if (!chat) throw new Error("Chat room does not exist!");


    if (chat.isGroup) {
      const isMember = chat.members.some(m => m.user.toString() === senderId);
      if (!isMember) {
        console.log("Sender not in group → message blocked");
        return;
      }
    }


    const message = await Message.create({
      chatId,
      sender: senderId,
      content,
    });

   
    io.to(`chat_${chatId}`).emit("message-received", message);

    
    if (chat.isGroup) {
     
      await ChatRoom.updateOne(
        { _id: chatId },
        {
          $inc: {
            "members.$[elem].unreadCount": 1,
          },
        },
        {
          arrayFilters: [
            { "elem.user": { $ne: senderId } } 
          ],
        }
      );
      chat.members
        .filter(m => m.user.toString() !== senderId)
        .forEach(m => {
          io.to(`user_${m.user.toString()}`).emit("new-message", message);
        });

    } else {
     
    
       const otherUserId = chat.members.find(m => m.user.toString() !== senderId)?.user.toString();

      if (otherUserId) {
        await User.updateOne(
          { _id: otherUserId, "contacts.chatId": chatId },
          { $inc: { "contacts.$.unreadCount": 1 } }
        );

        
        io.to(`user_${otherUserId}`).emit("new-message", message);
      }
    }

  } catch (err) {
    console.error("ERROR in send-message:", err);
  }
});

   

  socket.on('mark-seen', async ({ chatId, userId, messageIds }) => {
  if (!chatId || !userId || !Array.isArray(messageIds) || messageIds.length === 0) return;
  try {
    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $addToSet: { seenBy: userId } }
    );
    const msgs = await Message.find({ _id: { $in: messageIds } }).select('_id sender');

    for (const m of msgs) {
      io.to(`user_${String(m.sender)}`).emit('message-read', {
        messageId: m._id,
        readerId: userId
      });
    }
  } catch (err) {
    console.error("Error in mark-seen:", err);
  }
});






     socket.on('disconnect', () => {
  
        
        
        for (const [userId, sid] of onlineUsers.entries()) {
            if (sid === socket.id) {
                onlineUsers.delete(userId)
                io.emit("user-offline", userId);

                break; 
            }
        }
    })

 })


// middleware ;
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// data base connections 

mongoose.connect(URI)
        .then(result=>{
            server.listen(PORT,()=>{
                console.log("connected to the database ")
                console.log("listening  to port number ",PORT)
            })
        })
        .catch((err)=>
        {
            console.error("ERROR : couldn't connect to the data base :", err);

        })




//routes 

app.get ('/',(req,res)=>{
    
    res.send("hello this is the first version of your chat appkakngjkakrgkljoaer");

})

app.get('/ychat', requireAuth,async(req, res) =>{ 

    const  userInfo = req.user;
    if (userInfo){
    try{
    const userDocument= await User.findOne({_id:userInfo.id,userName:userInfo.name})
    const {password,...user} =userDocument.toObject();
     
     return res.status(200).json(user)

    }catch(err){
        onscrollend.log("ERROR: somethig wet wrong",err)
       return res.status(401).json({mssg:"unexpected error"})
    }

    } 
    return res.status(401).json({mssg:"anutherized user"})

    })
app.use(crudRoute)
app.use(authRoute);
app.use(chatRoute)

app.get("/messages", requireAuth, async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "unauthorized user" });
  }

  try {
    const { chatId, page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limitNum);

    const totalCount = await Message.countDocuments({ chatId });

    

    res.json({
      page: pageNum,
      limit: limitNum,
      totalCount,
      messages: messages.reverse() 
    });

  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
});

