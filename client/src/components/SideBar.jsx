import logo from '../assets/icons/Ychat_Logo.svg';
import contacts from '../assets/icons/Contacts.svg'
import profile from '../assets/icons/Profile.svg'
import message from "../assets/icons/Message.svg"
import setting from "../assets/icons/Setting.svg"
import logOut from "../assets/icons/Log_out.svg";
import { NavLink } from 'react-router-dom';
import React, { useState } from 'react';
import ModalWrapper from '../pages/Modals/ModalWrapper.jsx'
import ProfileModal from '../pages/Modals/ProfileModal';
import ContactsModal from '../pages/Modals/ContactsModal.jsx';
import Setting from '../pages/Modals/Setting.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateGroupModal from '../pages/Modals/CreateGroupModal.jsx';






function SideBar() {


  const navigate = useNavigate()
  const [profileOpen, setProfileOPen] = useState(false);
  const [contactOpen, setContactOPen] = useState(false)

  const [settingOpen, setSettingOPen] = useState(false);
  const [modal, setModal] = useState(false)



  const handleLogOut = async () => {

    try {
      console.log("asking logout")
      const res = await axios.get('http://localhost:3000/logout',
        { withCredentials: true }
      )
      console.log("logged out successfully")
      navigate('/auth/login') // this will be changed to the landing page
    } catch (err) {
      console.log("ERROR : couldn't log out", err)
    }

  }

  return (
    <div className='hidden md:flex flex-col items-center w-20 h-screen justify-between bg-linear-to-b from-sidebar-start  to-sidebar-end text-white py-6'>
      {/* log */}
      <div className="flex flex-col items-center gap-3">
        <img src={logo} alt="y chat logo" />
      </div>

      <ul className='list-none flex flex-col items-center gap-8 mt-0'>

        {/* the profile modal */}
        <li >
          <div className={`p-2 rounded-sm ${!contactOpen && profileOpen ? "bg-blue-900 bg-opacity-30 border-2 border-white" : ""}`}
            onClick={
              () => setProfileOPen(true)
            }>

            <img
              src={profile}
              alt="profile"
              className='w-8 h-8 hover:scale-110 hover:opacity-80 transition-transform cursor-pointer'
            />
          </div>

        </li>
        <ModalWrapper open={profileOpen} onClose={() => setProfileOPen(false)}>
          <ProfileModal onClose={() => setProfileOPen(false)} />
        </ModalWrapper>
        {/* contact modal */}

        <li >

          <div className={`p-2 rounded-sm ${contactOpen && !profileOpen ? "bg-blue-900 bg-opacity-30 border-2 border-white" : ""}`}
            onClick={
              () => setContactOPen(true)
            }>

            <img
              src={contacts}
              alt="contacts"
              className='w-8 h-8 hover:scale-110 hover:opacity-80 transition-transform cursor-pointer'
            />
          </div>

        </li>
        <ModalWrapper open={contactOpen} onClose={() => setContactOPen(false)}>
          <ContactsModal onClose={() => setContactOPen(false)} />
        </ModalWrapper>

        <li >
          <NavLink to={`/message`}>
            {({ isActive }) => (
              <div className={`p-2 rounded-sm ${isActive && !profileOpen && !contactOpen ? "bg-blue-900 bg-opacity-30 border-2 border-white" : ""}`}>
                <img
                  src={message}
                  alt="message"
                  className='w-8 h-8 hover:scale-110 hover:opacity-80 transition-transform cursor-pointer'
                />
              </div>
            )}
          </NavLink>
        </li>

      </ul>

      <div className="flex flex-col items-center gap-6">

        <div className="relative" onClick={() => setSettingOPen(true)}>
          <img
            src={setting}
            alt="setting"
            className="w-6 h-6 hover:rotate-45 transition-transform cursor-pointer"
          />
          <ModalWrapper open={modal} onClose={() => setModal(false)}>
            <CreateGroupModal onClose={() => setModal(false)} />
          </ModalWrapper>

          {settingOpen ? <Setting onOpenProfile={() => {
            setSettingOPen(false);
            setProfileOPen(true);
          }}
            onOpenCreateGroup={() => {
              setSettingOPen(false);
              setModal(true);
            }}

            onClose={() => setSettingOPen(false)} /> : ""}
        </div>


        <img
          src={logOut}
          alt='setting'
          onClick={handleLogOut}
          className="w-6 h-6 hover:scale-110 hover:text-red-500 transition-transform cursor-pointer" />
      </div>

    </div>
  );
}




export default SideBar