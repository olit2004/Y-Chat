import React, { useState, useEffect } from 'react';
import menu from '../assets/icons/three_point.svg';
import Profile from './Profile';
import axios from 'axios';
import { useChatList } from '../context/chatList';
import profile from '../assets/icons/default profile.svg';
import { useUser } from "../context/userContext"
import GroupProfile from '../pages/Modals/GroupProfile';
import { useNavigate } from 'react-router-dom';

function To({ chatId }) {
  const navigate = useNavigate();
  const [chatInfo, setChatInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);


  const { contacts, refetchContacts } = useChatList()
  const [isNotContact, setIsNotContact] = useState(false);
  const { user } = useUser()
  const fetchContact = async (chatId) => {
    try {
      const res = await axios.get('http://localhost:3000/contact-by-chat', {
        params: { chatId },
        withCredentials: true
      });

      const { type, contact, group } = res.data;

      if (type === "private") {
        setChatInfo({ type: "private", contact });
      } else if (type === "group") {
        setChatInfo({ type: "group", group });
      }
    } catch (err) {
      console.log("ERROR: couldn't fetch the contact info or group info based on the chat id", err);
    }
  };


  useEffect(() => {
    if (chatId) {
      fetchContact(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    if (chatInfo?.type === "private") {
      const exists = contacts.find(
        c => c.contactId === chatInfo.contact.contactId
      );
      setIsNotContact(!exists);
    }
  }, [chatInfo, contacts]);

  const addContact = async (userName) => {
    try {
      await axios.post(
        'http://localhost:3000/user/addContact',
        { userName },
        { withCredentials: true }
      );
      refetchContacts();
    } catch (err) {
      console.log("ERROR: couldn't add the user to your contact", err);
    }
  };

  const BASE_URL = 'http://localhost:3000';
  const getProfileImage = (path) => {
    if (!path) return profile;
    return path.startsWith('http') ? path : `${BASE_URL}${path}`;
  };

  if (!chatInfo) {
    return (
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-white shadow-sm border-b border-gray-200">
        <h2 className="text-xl text-gray-500 px-6 py-3">Loading contact...</h2>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-contact-list shadow-sm border-b border-gray-200 z-50">
      <div className="flex gap-2 items-center relative">
        <button
          onClick={() => navigate('/message')}
          className="md:hidden p-2 hover:bg-gray-100 rounded-full text-text-primary"
          aria-label="Back to contacts"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        {chatInfo.type === "group" ? (
          <div className='flex flex-col'>
            <div className='flex items-center'>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold"
                onClick={() => setIsOpen(true)}>
                {chatInfo.group.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-text-primary px-3 md:px-6 py-3 tracking-wide">
                {chatInfo.group.name}
              </h2>
            </div>
            <p className="text-xs md:text-sm text-gray-500 ml-2">
              {chatInfo.group.members?.length} members
            </p>
          </div>
        ) : (
          <div className='flex items-center'>
            <img
              src={getProfileImage(chatInfo.contact.profilePicture)}
              alt="toProfile"
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            />
            <h2 className="text-xl md:text-3xl font-bold text-text-primary px-3 md:px-6 py-3 tracking-wide">
              {chatInfo.contact.userName}
            </h2>
          </div>
        )}

        {isOpen && chatInfo.type === "private" && (
          <Profile contact={chatInfo.contact} onClose={() => setIsOpen(false)} />
        )}
        {isOpen && chatInfo.type === "group" && (
          <GroupProfile
            group={chatInfo.group}
            currentUserId={user._id}
            onClose={() => setIsOpen(false)}
            refetchGroup={() => fetchContact(chatId)}
          />
        )}

      </div>

      {chatInfo.type === "private" && isNotContact && (
        <button
          className="cursor-pointer ml-2 px-3 py-3 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded"
          onClick={() => addContact(chatInfo.contact.userName)}
        >
          Add to contact
        </button>
      )}

      <img src={menu} alt="menu" className="h-8" />
    </div>
  );
}

export default To;