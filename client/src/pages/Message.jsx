import React, { useEffect, useState } from 'react'
import Contactlist from '../components/Contactlist';
import ChatWindow from '../components/ChatWindow';
import Active from '../components/Active';
import { Outlet, useParams } from 'react-router-dom';
import { useSocket } from '../context/socketContext';
import { useChatList } from '../context/chatList';

function Message() {

  const { id } = useParams();
  const [activeChat, setActiveChat] = useState(null)
  const { contacts, setContacts, updateContactStatus } = useChatList();

  const { socket } = useSocket();

  const isChatSelected = !!id;


  console.log("the active caht i d is ", activeChat)
  useEffect(() => {
    if (!socket) return;

    const handleUserOnline = (userId) => {
      updateContactStatus(userId, true);
    };

    const handleUserOffline = (userId) => {
      updateContactStatus(userId, false);
    };



    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);



    return () => {
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);

    };
  }, [socket]);
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (activeChat === msg.chatId) return;

      setContacts((prev) =>
        prev.map((contact) =>
          contact.chatId === msg.chatId
            ? { ...contact, unreadCount: (contact.unreadCount || 0) + 1 }
            : contact
        )
      );
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, activeChat]);

  return (
    <div className="flex flex-1 overflow-hidden relative">
      <div className={`${isChatSelected ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-auto`}>
        <Contactlist />
      </div>
      <div className={`${isChatSelected ? 'flex' : 'hidden md:flex'} flex-1`}>
        <Outlet context={{ activeChat, setActiveChat }} />
      </div>
      <div className="hidden lg:flex">
        <Active />
      </div>
    </div>
  )
}

export default Message