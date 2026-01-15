import react,{createContext,useContext,useEffect,useState} from 'react';
import axios from "axios"


// create contesxt for contacts
const contactContext= createContext();

//  create custom hook for  getting data fro the context

export const useContacts =()=>{
    const context= useContext(contactContext)
    if (!context){
        throw new Error("you have to use useContaxctsin side a provider")
    }
    return context
}

export const ContactProvider =({children})=>{
    const [contacts,setContacts]= useState([])
    const[loading,setLoading]=useState(true)
    const [error,setError]= useState(null)
    const fetchContacts =async ()=>{
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:3000/user/contacts',{withCredentials:true})
            
            setContacts(res.data)
            console.log( " teh data bieng sent is", res.data)
        }catch(err){
              setError('Failed to fetch contacts');
              console.error('Error fetching contacts:', err);

        }finally {
            setLoading (false);
        }

    }
const updateContactStatus = (userId, isOnline) => {
  setContacts(prev =>
    prev.map(contact =>
      contact.contactId === userId
        ? { ...contact, isOnline }
        : contact
    )
  );
};

    
useEffect(() => {
    fetchContacts();
  }, []);

 const value = {
    contacts,
    loading,
    setContacts,
    updateContactStatus,
    error,
    refetchContacts: fetchContacts,
    
  };




    return (
       < contactContext.Provider value={value}>
        {children}
       </contactContext.Provider>
    )

}


