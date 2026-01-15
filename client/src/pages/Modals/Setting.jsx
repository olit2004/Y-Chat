import React, { useEffect, useRef, useState } from 'react';
import ModalWrapper from "./ModalWrapper";
import CreateGroupModal from './CreateGroupModal';
import ThemeToggle from '../../components/ThemeToggle';

function Setting({ onOpenProfile, onClose,onOpenCreateGroup }) {
  const modalRef = useRef(null);
  const [modal, setModal] = useState(false);

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
      ref={modalRef}
      className="absolute -top-40 -right-45 w-48 bg-surface/95 backdrop-blur-md rounded-2xl shadow-xl z-200 p-4 flex flex-col items-start space-y-3 border border-gray-100 transition-all duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="absolute top-3 right-3 text-text-primary hover:text-gray-900 hover:scale-110 cursor-pointer"
        onClick={onClose}
      >
        ✕
      </button>

      <h2 className="text-text-primary text-lg font-semibold border-b border-gray-200 pb-1 w-full">
        Settings
      </h2>

      <button
        className="w-full text-left text-text-primary hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-2 transition-colors duration-200"
        onClick={onOpenProfile}
      >
        Profile
      </button>

  <ThemeToggle/>

      <button
        className="w-full text-left text-text-primary hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 py-2 transition-colors duration-200"
        onClick={onOpenCreateGroup}
      >
        Create Group
      </button>


    </div>
  );
}

export default Setting;