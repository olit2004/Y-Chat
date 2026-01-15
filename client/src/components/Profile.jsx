import React,{ useRef, useEffect} from 'react'

function profile({contact,onClose}) {
  console.log("the profile you are passing is ",contact)
  const modalRef = useRef(null);
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

  <div className="absolute w-80 top-15 left-2 z-100"
  ref={modalRef}>
    <div className="bg-surface rounded-2xl shadow-2xl w-full mx-auto p-6 relative flex flex-col items-center">
      <button
        onClick={onClose}
        className="absolute top-3 right-6 text-text-primary hover:text-gray-900 hover:scale-110 cursor-pointer">
        ✕
      </button>
            <div className="relative inline-block">
            <img
                src={contact.profilePicture}
                alt={contact.userName}
                className="w-30 h-30 rounded-full object-cover border-4 border-blue-400" />
</div>
   
          <h2 className="text-2xl font-semibold text-text-primary mt-4">{contact.userName}</h2>

          <p className="text-gray-500 text-sm mt-1">{contact.bio?contact.bio:""}</p>


          <div className="w-full mt-5 space-y-3 text-text-primary">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span>Phone</span>
              <span>{contact.tel?contact.tel:""}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span>Email</span>
              <span>{contact.email?contact.email:""}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span>lastSeen</span>
              <span>{contact.lastSeen?contact.lastSeen:""}</span>
            </div>
          </div>
     
    </div>
    </div>
  );
}

export default profile