import React, { useEffect, useState } from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';
import { useContacts } from '../context/contactsContext';
import profile from '../assets/icons/default profile.svg';

function Active() {
  const { activeChat } = useOutletContext() || {};
  const { contacts } = useContacts();
  const [loading, setLoading] = useState(true);

  // Watch for contacts updates
  useEffect(() => {
    if (contacts) {
      setLoading(false);
    }
  }, [contacts]);

  const activeContacts = contacts?.filter(contact => contact.isOnline) || [];
  const BASE_URL = 'http://localhost:3000';

  const getProfileImage = (path) => {
    if (!path) return profile;
    return path.startsWith('http') ? path : `${BASE_URL}${path}`;
  };

  return (
    <div className="relative h-full p-6 border-l border-border-subtle bg-contact-list/50">
      <h2 className="text-center text-xs font-bold text-text-secondary uppercase tracking-widest mb-8">
        Active Now
      </h2>

      <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100%-4rem)] scrollbar-hide items-center">
        {loading ? (
          <div className="flex flex-col gap-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-12 h-12 bg-item-hover rounded-full" />
            ))}
          </div>
        ) : activeContacts.length === 0 ? (
          <p className="text-center text-text-secondary text-[10px] uppercase opacity-50 mt-4">No active users</p>
        ) : (
          activeContacts.map((contact) => (
            <NavLink
              key={contact.userName}
              to={`/message/chat/${contact.chatId}`}
              className={({ isActive }) =>
                `relative w-13 h-13 rounded-full transition-all flex items-center justify-center p-1 ${isActive ? 'bg-item-active shadow-md' : 'hover:bg-item-hover'
                }`
              }
            >
              <img
                src={getProfileImage(contact.profilePicture)}
                alt={contact.userName}
                className={`w-11 h-11 rounded-full object-cover border-2 ${activeChat === contact.chatId ? 'border-white' : 'border-surface'}`}
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-surface rounded-full shadow-sm"></span>
            </NavLink>
          ))
        )}
      </div>
    </div>
  );
}

export default Active;