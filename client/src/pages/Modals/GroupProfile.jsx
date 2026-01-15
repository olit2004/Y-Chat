import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import profile from '/src/assets/icons/default profile.svg';

function GroupProfile({ group, currentUserId, onClose, refetchGroup }) {
  const [newMemberUserName, setNewMemberUserName] = useState("");
  const modalRef = useRef(null);

  const BASE_URL = 'http://localhost:3000';
  const getProfileImage = (path) => {
    if (!path) return profile;
    return path.startsWith('http') ? path : `${BASE_URL}${path}`;
  };

  const isAdmin = group.members.some(
    m => m.userId === currentUserId && m.isAdmin
  );

  const addMember = async () => {
    try {
      await axios.post(
        'http://localhost:3000/group/addMember',
        { chatId: group.chatId, userName: newMemberUserName },
        { withCredentials: true }
      );
      setNewMemberUserName("");
      refetchGroup();
    } catch (err) {
      console.error("ERROR: couldn't add member", err);
    }
  };

 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="absolute w-96 top-20 left-10 z-50"
      ref={modalRef}
    >
      <div className="bg-surface rounded-2xl shadow-2xl w-full mx-auto p-6 relative flex flex-col">
       
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-text-primary hover:text-gray-500 hover:scale-110 cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">{group.name}</h2>

        {/* Members list */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {group.members.map(member => (
            <div key={member.userId} className="flex items-center gap-3">
              <img
                src={getProfileImage(member.profilePicture)}
                alt={member.userName}
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
              />
              <div>
                <p className="font-semibold">{member.userName}</p>
                <p className="text-sm text-gray-500">
                  {member.isOnline ? "Online" :""}
                </p>
              </div>
              {member.isAdmin && (
                <span className="ml-auto text-xs text-blue-500 font-medium">Admin</span>
              )}
            </div>
          ))}
        </div>

    
        {isAdmin && (
          <div className="mt-4">
            <input
              type="text"
              value={newMemberUserName}
              onChange={(e) => setNewMemberUserName(e.target.value)}
              placeholder="Enter username to add"
              className="border px-2 py-1 rounded w-full mb-2"
            />
            <button
              onClick={addMember}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Add Member
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupProfile;