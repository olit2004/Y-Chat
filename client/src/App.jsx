import React, { useEffect, createContext, useState } from 'react';
import SideBar from './components/SideBar';
import Horizontal from './components/Horizontal';
import { Outlet, useNavigate } from 'react-router-dom';
import useAskAuth from './hooks/useAskAuth';
import { UserProvider, useUser } from './context/userContext'
import { ContactProvider } from './context/contactsContext';
import { SocketProvider, useSocket } from './context/socketContext';
import { ChatListProvider } from './context/chatList';



import MobileNav from './components/MobileNav';

function AppComponent() {


  const { socket } = useSocket();



  const navigate = useNavigate();
  const { user, auth, isLoading } = useUser();



  if (isLoading) {
    return <h1>Loading...</h1>;
  }


  if (!auth) {
    navigate('/auth/login');
    return null;
  }



  return (

    <div className="flex h-screen bg-surface overflow-hidden">
      <SideBar />
      <div className="flex flex-col flex-1 pb-16 md:pb-0">
        <Horizontal />
        <Outlet />
        <MobileNav />
      </div>
    </div>

  );
}



function App() {
  return (
    < UserProvider>
      <ContactProvider>
        <ChatListProvider>
          <SocketProvider>
            <AppComponent />

          </SocketProvider>
        </ChatListProvider>
      </ContactProvider>

    </UserProvider>
  )
}
export default App;