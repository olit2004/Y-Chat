import React, { useState,useContext,useEffect } from "react";
import axios from "axios";
import {useUser} from "/src/context/userContext"
import profile from "/src/assets/icons/default profile.svg";
import UpdateProfilePic from "./UpdateProfilePic";
import CreateGroupModal from './CreateGroupModal';



function ProfileModal({  onClose }) {
  
  const {user,setUser,refetchUser} =useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatar, setAvatar] = useState(profile);
  const [formData, setFormData] = useState({
    name: '',
    tel: '',
    bio: '',
  });

const BASE_URL = 'http://localhost:3000'; 

const getProfileImage = (path) => {
  if (!path) return profile;
  return path.startsWith('http') ? path : `${BASE_URL}${path}`;
};


  useEffect(()=>{
    if (user&&user.profilePicture){
      console.log("the profile picture is ",user.profilePicture)
      setAvatar(user.profilePicture)

    }
  },[user])

  useEffect(()=>{
    setFormData({
      name: user?user.name:'not available',
      tel: user? user.tel:'not available',
      bio: user? user.bio:'not available',
    })

  },[user])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
     
    e.preventDefault();
    try{
         const  res= await axios.post("http://localhost:3000/userProfile",formData,{withCredentials:true});
         setUser(res.data)

    }catch(err){
      console.log("ERROR: something went wrong" ,err)
    }

    setIsEditing(false);
    
  };

  const handleAvatarUpdate =async (avatarData)=>{
    try {
        if (typeof avatarData==="string" && avatarData.startsWith("http")

        ){
          
          await axios.post("http://localhost:3000/user/avatar-url", { url: avatarData }, { withCredentials: true });
        }else{
          const formData =new FormData();
         formData.append("avatar", avatarData); 
          await axios.post("http://localhost:3000/user/avatar-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });



        }
      refetchUser()

    }catch(err){
       console.error("Avatar update failed", err);

    }
  }
  
  return (
    <div className="bg-surface rounded-2xl shadow-2xl w-full mx-auto p-6 relative flex flex-col items-center">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-text-primary hover:text-gray-500 hover:scale-110 cursor-pointer"
      >
        ✕
      </button>
<div className="relative inline-block">
  <img
    src={user ?getProfileImage(user.profilePicture):profile}
    alt={user?user.userName:""}
    className="w-30 h-30 rounded-full object-cover border-4 border-blue-400"
  />

  <button
    onClick={() => setShowAvatarModal(true)}
    className="absolute bottom-1 right-1 bg-amber-600 text-white p-2 rounded-full hover:bg-orange-600 text-sm"
  >
    ✎
  </button>

  {showAvatarModal && (
    <UpdateProfilePic
      onClose={() => setShowAvatarModal(false)}
      onSelect={(newAvatar) => {setAvatar(newAvatar)
        handleAvatarUpdate(newAvatar)
      }}
    />
  )}
</div>

      {!isEditing ? (
        <>
          <h2 className="text-2xl font-semibold text-text-primary mt-4">{user?user.userName:""}</h2>
          <p className="text-gray-400 text-sm mt-1">{user?user.bio:"not available"}</p>

          <div className="w-full mt-5 space-y-3 text-text-primary">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span>Phone</span>
              <span>{user?user.tel:"not available"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span>Email</span>
              <span>{user?user.email:"not available"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span>Joined</span>
              <span>{user?user.createdAt:"not available"}</span>
            </div>
          </div>

          <div className="mt-6 w-full flex flex-col gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
            >
              Edit Profile
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium">
              Settings
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="w-full mt-4 space-y-4">
          <div>
            <label className="block text-sm text-text-primary mb-1">Username</label>
            <input
              name="username"
              value={formData.name}
              onChange={handleChange}
              className="w-full border  text-text-primary border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm text-text-primary mb-1">Phone</label>
            <input
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              className="w-full border text-text-primary border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-text-primary mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full border  text-text-primary border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 mt-5">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-sm font-medium"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}


    </div>
  );
}







export default ProfileModal;