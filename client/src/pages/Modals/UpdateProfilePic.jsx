
import React, { useState, useRef, useEffect } from "react";
import profile from "/src/assets/icons/Male_profile.svg";


// here the logic of updating and hgow to select profile picture and connection to the databes shoyld be added

function UpdateProfilePic({ onClose, onSelect }) {
   const [url, setUrl] = useState("");
  const modalRef = useRef(null);
  const[useurl ,setUseurl]=useState(false);

 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onSelect(file);
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
 
      className="absolute right--10 bottom--10 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64 z-10"
    >
      <h3 className="text-sm font-semibold mb-3 text-gray-700">Update Profile Picture</h3>
      <div className="space-y-3">


        <label className="block w-full bg-indigo-400 text-white py-1 rounded text-center cursor-pointer hover:bg-indigo-600 text-sm">
          Upload Photo
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>

        
        {useurl?(<>
          <input
          type="text"
          placeholder="Paste image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border px-2 py-1 rounded text-sm bg-amber-800"
        />
        </>):(<></>)}
<button
  onClick={() => {
    if (useurl) {
      if (url) {
        onSelect(url);
        onClose();
      }
    } else {
      setUseurl(true);
    }
  }}
  className="w-full hover:bg-indigo-600 text-white py-1 rounded bg-indigo-500 text-sm"
>
  {!useurl ? "Use URL" : "Save"}
</button>

        <button
          onClick={onClose}
          className="w-full bg-gray-100 text-gray-700 py-1 rounded hover:bg-gray-200 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpdateProfilePic



 