import React, { useEffect, useState, useRef } from 'react';
import MessageInput from './MessageInput';
import To from './To';
import { useParams, useOutletContext } from 'react-router-dom';
import { useSocket } from '../context/socketContext';
import { useChatList } from '../context/chatList';
import { useUser } from '../context/userContext';
import axios from 'axios';
import threePoints from "/src/assets/icons/three_point.svg"

function ChatWindow() {

  const { id: chatId } = useParams();
  const { socket } = useSocket();
  const { contacts, setContacts } = useChatList();
  const { user } = useUser();
  const { activeChat, setActiveChat } = useOutletContext();
  const [totalMessage, setTotalMessage] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);


  const messagesEndRef = useRef(null);
  const senderId = user ? user._id : null;


  useEffect(() => {
    setActiveChat(chatId);
    setContacts(prev =>
      prev.map(c =>
        c.chatId === chatId
          ? { ...c, unreadCount: 0 }
          : c
      )
    );
  }, [chatId]);

  const getMessages = async (chatId, page = 1, limit = 20) => {
    try {
      const res = await axios.get('http://localhost:3000/messages', {
        params: { chatId, page, limit },
        withCredentials: true
      });

      const { messages, totalCount } = res.data;
      return { messages, totalCount };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { messages: messages || [], totalCount: totalCount || 0 };

    }
  };


  const fetchMessages = async (pageToLoad = 1) => {


    setLoading(true);
    const { messages, totalCount } = await getMessages(chatId, pageToLoad);

    if (messages.length === 0 || totalMessage.length + messages.length >= totalCount) {
      setHasMore(false);
    }

    setTotalMessage(prev => {
      const merged = [...messages.reverse(), ...prev];

      const unique = Array.from(
        new Map(merged.map(m => [m._id, m])).values()
      );

      return unique;
    });

    setPage(pageToLoad);
    setLoading(false);
  };

  useEffect(() => {
    setTotalMessage([]);
    setPage(1);
    setHasMore(true);
    fetchMessages(1);
  }, [chatId]);
  const listRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!listRef.current || loading || !hasMore) return;

      if (listRef.current.scrollTop === 0) {
        fetchMessages(page + 1);
      }
    };

    const listEl = listRef.current;
    listEl?.addEventListener('scroll', handleScroll);

    return () => listEl?.removeEventListener('scroll', handleScroll);
  }, [page, loading, hasMore]);



  useEffect(() => {



    if (socket && chatId) {
      socket.emit("join-chat", chatId, user._id);
    }

    return () => {
      if (socket && chatId) {
        socket.emit("leave-room", chatId);
      }
    };
  }, [chatId, socket, contacts]);

  useEffect(() => {
    const handleMessage = (data) => {
      console.log(" the data is", data);
      if (data.chatId == chatId) {
        setTotalMessage((prev) => [...prev, data]);
      }
    };

    if (socket) {
      socket.on('message-received', handleMessage);
    }

    return () => {
      if (socket) {
        socket.off('message-received', handleMessage);
      }
    };
  }, [socket, chatId]);

  useEffect(() => {

    if (!socket) return;
    const handleRead = ({ messageId, readerId }) => {
      setTotalMessage(prev =>
        prev.map(m =>
          m._id === messageId
            ? { ...m, seenBy: [...new Set([...(m.seenBy || []), readerId])] }
            : m
        )
      );
    }

    socket.on("message-read", handleRead)
    return () => {
      if (socket) {
        socket.off("message-read", handleRead)
      };

    }
  }, [socket]);

  useEffect(() => {
    if (!socket || !totalMessage.length) return;

    const unseen = totalMessage
      .filter(m => m.sender !== user._id && !m.seenBy.includes(user._id))
      .map(m => m._id);

    if (unseen.length === 0) return;

    socket.emit("mark-seen", {
      chatId,
      userId: user._id,
      messageIds: unseen
    });
  }, [totalMessage, socket, chatId,]);
  // scroll to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [totalMessage]);

  const handleSend = (content) => {
    if (!chatId || !senderId) {
      console.error("Cannot send message: Missing chat ID, sender ID, or ");
      return;
    }

    const payload = {
      chatId,
      senderId,
      content
    };

    if (socket) {
      socket.emit('send-message', payload);
    }
  };


  function formatTime(time) {
    const date = new Date(time);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours < 12 ? 'AM' : 'PM';
    const formattedHour = (hours % 12) || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinutes} ${period}`;
  }

  return (
    <div className="relative w-full md:m-3 bg-canva flex flex-1 flex-col overflow-hidden ">


      {/* the to component  */}
      <To chatId={chatId} />

      <ul ref={listRef}
        className="flex flex-col flex-1 overflow-y-auto px-2 md:px-4 py-4 space-y-3 mt-16 md:mt-20 mb-20 scroll-smooth">
        {totalMessage.map((message, index) => {
          const isSender = message.sender === senderId;

          return (
            <li
              key={index}
              className={`flex ${isSender ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`relative flex flex-col max-w-[80%] px-4 py-3 rounded-2xl shadow-sm border border-border-subtle/50 text-sm sm:text-base break-words transition-all duration-300 ${isSender
                  ? 'bg-bubble-sent text-white rounded-bl-none shadow-blue-500/10'
                  : 'bg-bubble-received text-text-primary rounded-br-none shadow-slate-950/5'
                  }`}
              >

                <p className="leading-relaxed">{message.content}</p>


                <div className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${isSender ? 'text-blue-100' : 'text-text-secondary'}`}>
                  <span>{formatTime(message.createdAt)}</span>
                  {isSender && (
                    <span className="flex items-center">
                      <span className="opacity-60 text-xs">✓</span>
                      {message.seenBy.length >= 1 && <span className="-ml-1 text-xs">✓</span>}
                    </span>
                  )}
                </div>


                <div
                  className={`absolute top-[18px] transform -translate-y-1/2 border-t-[6px] border-b-[6px] ${isSender
                    ? '-left-[6px] border-r-[6px] border-r-bubble-sent border-t-transparent border-b-transparent'
                    : '-right-[6px] border-l-[6px] border-l-bubble-received border-t-transparent border-b-transparent'
                    }`}
                />
              </div>
            </li>
          );
        })}

        <div ref={messagesEndRef} />
      </ul>

      <MessageInput handleSend={handleSend} />
    </div>
  );
}

export default ChatWindow;
