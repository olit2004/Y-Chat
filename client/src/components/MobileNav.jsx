import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import contactsIcon from '../assets/icons/Contacts.svg';
import profileIcon from '../assets/icons/Profile.svg';
import messageIcon from '../assets/icons/Message.svg';
import settingIcon from '../assets/icons/Setting.svg';
import ModalWrapper from '../pages/Modals/ModalWrapper.jsx';
import ProfileModal from '../pages/Modals/ProfileModal';
import ContactsModal from '../pages/Modals/ContactsModal.jsx';
import Setting from '../pages/Modals/Setting.jsx';
import CreateGroupModal from '../pages/Modals/CreateGroupModal.jsx';

function MobileNav() {
    const [profileOpen, setProfileOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [settingOpen, setSettingOpen] = useState(false);
    const [modal, setModal] = useState(false);

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
            {/* Profile */}
            <div
                className={`p-2 rounded-sm ${profileOpen ? "bg-blue-100" : ""}`}
                onClick={() => setProfileOpen(true)}
            >
                <img src={profileIcon} alt="profile" className="w-6 h-6 cursor-pointer" />
            </div>

            {/* Contacts */}
            <div
                className={`p-2 rounded-sm ${contactOpen ? "bg-blue-100" : ""}`}
                onClick={() => setContactOpen(true)}
            >
                <img src={contactsIcon} alt="contacts" className="w-6 h-6 cursor-pointer" />
            </div>

            {/* Messages */}
            <NavLink to="/message">
                {({ isActive }) => (
                    <div className={`p-2 rounded-sm ${isActive && !profileOpen && !contactOpen ? "bg-blue-100" : ""}`}>
                        <img src={messageIcon} alt="message" className="w-6 h-6 cursor-pointer" />
                    </div>
                )}
            </NavLink>

            {/* Settings */}
            <div
                className={`p-2 rounded-sm ${settingOpen ? "bg-blue-100" : ""}`}
                onClick={() => setSettingOpen(true)}
            >
                <img src={settingIcon} alt="setting" className="w-6 h-6 cursor-pointer" />
            </div>

            {/* Modals */}
            <ModalWrapper open={profileOpen} onClose={() => setProfileOpen(false)}>
                <ProfileModal onClose={() => setProfileOpen(false)} />
            </ModalWrapper>

            <ModalWrapper open={contactOpen} onClose={() => setContactOpen(false)}>
                <ContactsModal onClose={() => setContactOpen(false)} />
            </ModalWrapper>

            <ModalWrapper open={modal} onClose={() => setModal(false)}>
                <CreateGroupModal onClose={() => setModal(false)} />
            </ModalWrapper>

            {settingOpen && (
                <div className="absolute bottom-16 right-4">
                    <Setting
                        onOpenProfile={() => {
                            setSettingOpen(false);
                            setProfileOpen(true);
                        }}
                        onOpenCreateGroup={() => {
                            setSettingOpen(false);
                            setModal(true);
                        }}
                        onClose={() => setSettingOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}

export default MobileNav;
