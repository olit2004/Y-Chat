import React, { useContext, useEffect, useState } from 'react';
import profile from '../assets/icons/default profile.svg';
import bell from '../assets/icons/Bell.svg';
import { useUser } from "/src/context/userContext"
import SearchModal from "/src/pages/Modals/SearchModal.jsx"
import axios from 'axios'
import ModalWrapper from '../pages/Modals/ModalWrapper';
import ProfileModal from '../pages/Modals/ProfileModal';
import ThemeToggle from './ThemeToggle';


const BASE_URL = 'http://localhost:3000';

const getProfileImage = (path) => {
  if (!path) return profile;
  return path.startsWith('http') ? path : `${BASE_URL}${path}`;
};


function Horizontal() {

  const [profileOpen, setProfileOPen] = useState(false)

  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [result, setResult] = useState([])
  const [open, setOpen] = useState(false)




  useEffect(() => {
    if (!query.trim()) {
      setResult([])
      setOpen(false)
      return;
    }

    const delay = setTimeout(() => {
      handleQuery(query);

    }, 300);

    return () => clearTimeout(delay);

  }, [query])




  const handleQuery = async (q) => {

    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/search', {
        params: { q },
        withCredentials: true
      })

      setResult(res.data || []);
      setOpen(true)
    } catch (err) {
      console.error("Search failed:", err);
    }
    finally {
      setLoading(false);
    }

  }

  const { user, setUser } = useUser();


  return (

    <div className="flex relative items-center justify-between w-full px-4 md:px-6 py-2 md:py-3 shadow-sm border-b border-border-subtle bg-horizontal transition-colors">

      {/*  Search Bar */}
      <div className="relative w-full max-w-[150px] sm:max-w-sm">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 md:w-5 md:h-5 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-8 md:pl-10 pr-4 py-1.5 md:py-2 rounded-xl bg-message-input text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-item-active text-sm md:text-base transition-all"
        />
      </div>



      <div className="flex items-center gap-2 md:gap-4 ml-2 md:ml-6">
        <ThemeToggle />

        <button className="relative hover:scale-110 transition-transform">
          <img src={bell} alt="notification" className="w-5 h-5 md:w-6 md:h-6 text-text-primary" />

          <span className="absolute top-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full border border-white"></span>
        </button>

        <img
          src={user ? getProfileImage(user.profilePicture) : profile}
          alt="profile"
          onClick={() => setProfileOPen(true)}
          className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-border-subtle object-cover cursor-pointer hover:scale-105 transition-transform"
        />
        <ModalWrapper open={profileOpen} onClose={() => setProfileOPen(false)}>
          <ProfileModal onClose={() => setProfileOPen(false)} />
        </ModalWrapper>
        <h3 className="hidden sm:block text-xl md:text-2xl font-semibold text-text-primary">{user ? user.userName : ""}</h3>
      </div>
      {open && (
        <SearchModal
          results={result}
          loading={loading}
          setQuery={setQuery}
          onClose={() => setOpen(false)}
        />
      )}
    </div>



  );
}

export default Horizontal;
