import React,{useState} from 'react'
import Contactlist from '../../components/Contactlist'
import Addcontact from './Addcontact';

function ContactsModal({onClose}) {
  const [isAddContact,setIsAddContact]= useState(false)
  const modal=true;
  console.log("is add contact is ",isAddContact)

  if (isAddContact){return (
  <div className="flex flex-col max-h-[80vh]">
  

    {isAddContact && (
      <Addcontact onClose={() => setIsAddContact(false)} />
    )}
  </div>
);
}
  return (
    <div className="flex flex-col max-h-[80vh]">
 
  <div className="shrink-0 p-6 pb-3 relative text-text-primary mb-4">
    <button
      onClick={onClose}
      className="absolute top-6 right-6 text-text-primary hover:text-gray-900 hover:scale-110 cursor-pointer"
    >
      ✕
    </button>
    <h1 className="text-2xl font-semibold text-text-primary text-center">Your contacts</h1>
  </div>

  <div className="flex-1 overflow-y-auto p-4 mx-auto">
    <Contactlist modal={true} onClose={onClose} />
  </div>

  <div className="shrink-0 p-6 pt-3 border-t border-gray-100">
    <div className="flex justify-between items-center">
     <div className=" cursor-pointer text-lg text-blue-500 font-medium" onClick={()=>setIsAddContact(true)}>Add Contact</div>  
      <button 
        onClick={onClose}
        className="px-4 py-2 bg-gray-500 text-text-primary rounded-lg hover:bg-gray-200 text-sm transition"
      >
        Cancel
      </button>
    </div>
  </div>
</div>

  )
}

export default ContactsModal