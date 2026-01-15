import react,{createContext,useContext,useEffect,useState} from 'react';
import axios from "axios"


// create contesxt for contacts
const chatListContext= createContext();

//  create custom hook for  getting data fro the context

export const useChatList =()=>{
    const context= useContext(chatListContext)
    if (!context){
        throw new Error("you have to use useContaxctsin side a provider")
    }
    return context
}

export const ChatListProvider =({children})=>{
    const [contacts,setContacts]= useState([])
    const[loading,setLoading]=useState(true)
    const [error,setError]= useState(null)
    const fetchContacts =async ()=>{
        try {
            console.log("this is running najksngjknaskgkhasjhgkashgjhaslkhsjgklg ")
            setLoading(true);
            const res = await axios.get('http://localhost:3000/user/chatList',{withCredentials:true})
            
            setContacts(res.data)
            console.log( " the data being sent is", res.data)
        }catch(err){
             console.log("this is running najksngjknaskgkhasjhgkashgjhaslkhsjgklg in error ",error)
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
       < chatListContext.Provider value={value}>
        {children}
       </chatListContext.Provider>
    )

}


