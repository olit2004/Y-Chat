import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useContacts } from '../context/contactsContext'
import expand from '../assets/icons/expand_logo.svg'
import collapse_logo from "../assets/icons/collapse_logo.svg"
import { useChatList } from '../context/chatList'

import profile from '../assets/icons/default profile.svg';




function Contactlist({ modal, onClose }) {

  const [collapsed, setCollapsed] = useState(false)

  const { contacts, loading, error } = modal ? useContacts() : useChatList();


  const BASE_URL = 'http://localhost:3000';

  const getProfileImage = (path) => {
    if (!path) return profile;
    return path.startsWith('http') ? path : `${BASE_URL}${path}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col bg-white h-full min-w-68 border-r border-gray-200">
        {!modal && <h1 className="text-gray-900 text-2xl font-semibold text-center py-6">Chat</h1>}
        <div className="flex flex-col gap-3 px-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-4 px-3 py-2 rounded-xl animate-pulse">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col bg-contact-list h-full w-64 border-r border-gray-200">
        {!modal && <h1 className="text-gray-900 text-2xl font-semibold text-center py-6">Chat</h1>}
        <div className="p-4 text-red-500 text-center">{error}</div>
      </div>
    )
  }
  if (!contacts) {
    return (
      <div className="flex flex-col bg-contact-list h-full w-64 border-r border-gray-200">
        {!modal && <h1 className="text-gray-900 text-2xl font-semibold text-center py-6">Chat</h1>}
        <div className="p-4 text-gray-500 text-center">Contacts could not be loaded</div>
      </div>
    );
  }


  return (
    <div
      className={`flex flex-col bg-contact-list border-r border-border-subtle ${modal ? '' : 'h-full'} ${collapsed ? "w-35 " : "w-72"}`}
    >

      {!modal && (<div className="flex items-center justify-between px-4 py-5 border-b border-border-subtle mb-4">
        <h1 className="text-text-primary text-2xl font-bold">Chat</h1>
        <button
          onClick={() => { setCollapsed((prev) => !prev) }}
          className="p-2 bg-item-hover rounded-lg hover:brightness-95 transition-all"
          aria-label={collapsed ? 'Expand contacts' : 'Collapse contacts'}
        >
          <img
            src={collapsed ? expand : collapse_logo}
            alt={collapsed ? "expand" : "collapse"}
            className="w-4 h-4 opacity-70"
          />
        </button>
      </div>
      )}

      <div className="flex flex-col gap-1 px-2 overflow-y-auto pb-6 scrollbar-hide">
        {contacts.length === 0 ? (
          <div className="text-center text-text-secondary py-8 text-sm">
            No contacts found
          </div>
        ) : (
          contacts.map((contact, index) => {
            const id = contact.chatId;


            if (!contact.isGroup) {
              return (
                <NavLink
                  key={contact._id}
                  to={`/message/chat/${id}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer group
              ${isActive
                      ? 'bg-item-active text-white shadow-sm'
                      : 'hover:bg-item-hover text-text-primary'
                    }`
                  }
                  onClick={() => onClose?.()}
                >
                  {({ isActive }) => (
                    <>
                      <div className="relative flex-shrink-0">
                        <img
                          src={getProfileImage(contact.profilePicture)}
                          alt={contact.userName}
                          className="w-11 h-11 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
                        />
                        {contact.unreadCount > 0 && (
                          <span
                            className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 flex items-center justify-center text-[10px] font-bold
                                border-2 border-contact-list rounded-full bg-red-500 text-white"
                          >
                            {contact.unreadCount}
                          </span>
                        )}
                      </div>

                      {!collapsed && (
                        <div className="flex flex-col overflow-hidden">
                          <h2 className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-text-primary'}`}>
                            {contact.nickname || contact.userName}
                          </h2>
                          <p className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-text-secondary'}`}>
                            Click to message
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            }


            return (
              <NavLink
                key={contact._id}
                to={`/message/chat/${id}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer group
      ${isActive
                    ? 'bg-item-active text-white shadow-sm'
                    : 'hover:bg-item-hover text-text-primary'
                  }`
                }
                onClick={() => onClose?.()}
              >
                {({ isActive }) => (
                  <>
                    <div className="relative flex-shrink-0">

                      <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                        {contact.name?.charAt(0).toUpperCase()}
                      </div>

                      {contact.unreadCount > 0 && (
                        <span
                          className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 flex items-center justify-center text-[10px] font-bold
                        border-2 border-contact-list rounded-full bg-red-500 text-white"
                        >
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>

                    {!collapsed && (
                      <div className="flex flex-col overflow-hidden">
                        <h2 className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-text-primary'}`}>
                          {contact.name}
                        </h2>
                        <p className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-text-secondary'}`}>
                          {contact.membersCount} members
                        </p>
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })
        )}
      </div>
    </div>
  )
}

export default Contactlist