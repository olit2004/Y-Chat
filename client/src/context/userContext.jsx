import  React,{useState,useEffect,useContext,createContext} from 'react';
import useAskAuth from '../hooks/useAskAuth';


// create the context object
const userContext= createContext();


// hook for using the context
export  const useUser =()=>{
    const context=useContext(userContext);
    if (!context){
        throw new ERROR ("you must use useUser inside context provider")

    }
    return context;
}

// component that provides the context 

export const UserProvider=({children})=>{
     const [user, setUser] = useState(null);
     const { auth, isLoading, data,refetch } = useAskAuth('http://localhost:3000/ychat');

       
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]); 


  const refetchUser = async () => {

  console.log("refecthing running in the user context")
  await refetch(); 
};


  const value = { user, setUser, auth, isLoading,refetchUser };

  return (
    <userContext.Provider value={value}>
        {children}
    </userContext.Provider>
  )
}


