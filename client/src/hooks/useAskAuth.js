import { useState,useEffect,useCallback  } from "react";
import axios from 'axios';
 
const useAskAuth =(endpoint)=>{
    const [data,setData]= useState(null);
    const [isLoading,setIsLoading] =useState (true);
    const [auth,setAuth]=useState(false);

    const checkAuth =  useCallback(async () => {


    try{
        const res=await axios.get(endpoint,{withCredentials:true});
        setData(res.data);
        setAuth(true)


    }catch(err){
        console.log("Error occured",err.response.data)
        setAuth(false);
    }finally{
        setIsLoading(false);
    }
    
 


},[endpoint])

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


return {auth,isLoading,data, refetch:checkAuth};
}


export default useAskAuth;