import React, { useState } from 'react';
import axios from 'axios';
import { useContacts } from "/src/context/contactsContext";

function Addcontact({ onClose }) {
const { refetchContacts } = useContacts();

  const [userName, setUserName] = useState('');
  const [nickName, setNickName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:3000/user/addContact',
        { userName, nickname: nickName },
        { withCredentials: true }
      );

    //   onSuccess(res.data);   
      refetchContacts()
      onClose();            
    } catch (error) {
      if (error.response?.data?.message || error.response?.data?.mssg) {
        setError(error.response.data.message || error.response.data.mssg);
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-8 bg-surface rounded-lg shadow-xl w-full relative z-200">

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-text-primary hover:text-gray-900 hover:scale-110 cursor-pointer text-xl"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-6 text-text-primary">Add New Contact</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            User Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Nick Name (optional)
          </label>
          <input
            type="text"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end items-center mt-4 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-text-primary rounded-lg hover:bg-gray-400 text-sm transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition font-medium disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Contact"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Addcontact;
