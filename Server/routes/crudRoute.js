const express = require('express');
const route= express.Router();
const  upload = require('../middleware/uploadAvatars.js')
const User = require('../models/User.js')
const requireAuth =require('../middleware/requireAuth.js')
const {updateUserProfilehandler,getContacts,getChat,addContact,search} = require('../controller/crudUserController.js')

route.post('/userProfile',requireAuth,updateUserProfilehandler)
route.get('/user/chatList',requireAuth,getChat)
route.get('/user/contacts',requireAuth ,getContacts)
route.post('/user/addContact',requireAuth,addContact)
route.get('/search',requireAuth,search)

route.post("/user/avatar-upload",requireAuth, upload.single("avatar"), async (req, res) => {
    if (!req.user){
        res.status(401).json({message:"unAuthorized"})

    }
  const filePath = `/uploads/avatars/${req.file.filename}`; 
  await User.findByIdAndUpdate(req.user.id, { profilePicture: filePath });
  res.json({ success: true, profilePicture: filePath });
});

route.post("/user/avatar-url",requireAuth, async (req, res) => {
  if (!req.user){
        res.status(401).json({message:"unAuthorized"})
    }

  const {url} = req.body;
        await User.findByIdAndUpdate(req.user.id, { profilePicture: url });
        res.json({ success: true, profilePicture: url });
});








module.exports= route;