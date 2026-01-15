import { useState, useMemo, useEffect } from "react";
import { useContacts } from "../../context/contactsContext";

import axios from "axios";

function CreateGroupModal({ onClose }) {
  const { contacts }= useContacts();

  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");

  const createGroup =async ({name,members,admins})=>{
    try{
      const res = await axios.post("http://localhost:3000/create-group",{
        name,members,admins
    },{withCredentials:true})
      console.log("succefully created and the chatis i s",res.data)

    }catch(err){
      console.log("ERROR: couldn't create the group",err)
    }
  }



  const filteredContacts = useMemo(() => {
    return contacts.filter((c) =>
      c.userName.toLowerCase().includes(search.toLowerCase())
    );
  }, [contacts, search]);

  const toggleMember = (contactId) => {
    setMembers((prev) =>
      prev.includes(contactId)
        ? prev.filter((m) => m !== contactId)
        : [...prev, contactId]
    );
    setAdmins((prev) => prev.filter((a) => a !== contactId));
  };

  const toggleAdmin = (contactId) => {
    setAdmins((prev) =>
      prev.includes(contactId)
        ? prev.filter((a) => a !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, members, admins });
    createGroup({name,members,admins})
    setAdmins([])
    setMembers([])
    setName("")
    onClose();
  };

  return (
    <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg mx-auto p-6 text-text-primary">
      <h2 className="text-xl font-semibold">Create Group Chat</h2>

      <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Group Name */}
        <input
          type="text"
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />

        {/* Search Field */}
        <input
          type="text"
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {/* Member + Admin List */}
        <div className="rounded overflow-y-auto max-h-72 border border-gray-200">
          {/* Header */}
          <div className="flex justify-between px-3 py-2 bg-gray-50 font-medium text-text-primary border-b border-gray-200">
            <span>Members</span>
            <span>Admin</span>
          </div>

          {/* Contact Rows */}
          {filteredContacts.length === 0 ? (
            <p className="p-3 text-gray-500">No users found</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredContacts.map((c) => (
                <li
                  key={c.contactId}
                  className="flex justify-between items-center px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  {/* Member checkbox + name */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={members.includes(c.contactId)}
                      onChange={() => toggleMember(c.contactId)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium">{c.userName}</span>
                  </label>

                  {/* Admin checkbox */}
                  <input
                    type="checkbox"
                    checked={admins.includes(c.contactId)}
                    onChange={() => toggleAdmin(c.contactId)}
                    disabled={!members.includes(c.contactId)}
                    className="rounded text-blue-600 focus:ring-blue-500 disabled:opacity-40"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGroupModal;