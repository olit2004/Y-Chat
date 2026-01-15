import React from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useChatList } from "/src/context/chatList";
import profile from '/src/assets/icons/default profile.svg';


function SearchModal({ results, loading, onClose ,setQuery}) {
   const navigate = useNavigate()

   const BASE_URL = 'http://localhost:3000';
    const getProfileImage = (path) => {
    if (!path) return profile;
    return path.startsWith('http') ? path : `${BASE_URL}${path}`;
  };

  const { refetchContacts } = useChatList();
  console.log("stuffs that are reaching search modal", { results, loading, onClose });

const handleClick = async (userId) => {
  try {
    const res = await axios.get("http://localhost:3000/privatechat", {
      params: { userId }, 
      withCredentials: true,
    });

    const { chatRoomId } = res.data;
    setQuery("")
    navigate(`/message/chat/${chatRoomId}`);

    onClose()
  } catch (err) {
    console.error("ERROR: error occurred while getting chat room", err);
  }
};


const addContact =async (userName,userId)=>{
     try {
      const res = await axios.post(
        'http://localhost:3000/user/addContact',
        { userName },
        { withCredentials: true }
      );

    
      refetchContacts()
      handleClick(userId)
      onClose();            
    } catch (err) {
      console.log("ERROR: couldn't  add the user to your contact",err)
    }
  };



  return (
    <div className="absolute left-0 right-0 top-full bg-surface shadow-lg z-200 border border-gray-200 max-h-96 overflow-y-auto rounded-b-xl">
      {loading && (
        <div className="p-4 text-text-primary text-center text-sm">Searching...</div>
      )}

      {!loading && results.length === 0 && (
        <div className="p-4 text-text-primary text-center text-sm">No users found.</div>
      )}

      {!loading &&
        results.map((u) => {

          
          
          return (
          <div
            key={u._id}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors"
          >

            
            <div
              onClick={()=>handleClick(u._id)}
              className="flex items-center gap-3 cursor-pointer flex-1"
            >
              <img
                src={getProfileImage(u.profilePicture)}
                alt={`${u.userName}'s profile`}
                
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-text">{u.userName}</p>
                <p className="text-gray-500 text-sm">{u.name || "No name"}</p>
              </div>
            </div>
         

            <button className="ml-2 px-3 py-1 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded"
            onClick={()=>addContact(u.userName,u._id)}>
              Add  to contact 
            </button>
          </div>
        )})}
    </div>
  );
}

export default SearchModal;