const User = require('../models/User');
const jwt =require('jsonwebtoken')
require('dotenv').config();




const loginERROR=(err)=>{
   let errormessage="";

    if (err.message=="Invalid username or password"){
        errormessage="Invalid username or password"
   }else {
      errormessage="Something went wrong couldn't log  you in "
   }

   return errormessage;

}

const  signUpErrorhandler=(err)=>{

    const errors={UserName:'',password:"",email:"",bio:"" }

      if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0]; 
      errors[field] = `This ${field} is already registered`;
      console.log(errors)
      return errors;
      }

    //handling validation Error

    if (err.message.includes("User validation failed")){
     Object.values(err.errors).forEach((error)=>{
        errors[error.path]=error.message;
     }) 
    }
    return errors
}
//enviroment varaiable 
const SECRET  = process.env.JWT_SECRET


const age =60*60
const createToken=  (id,name)=>{
const token= jwt.sign({id,name},SECRET, {expiresIn:age})
return token;

} 


module.exports.loginHandler =async (req,res)=>{
    const {userName, password} =req.body;
    
     try{
        const user= await User.login(userName,password);
        const token  = createToken(user._id,user.userName);
        res.cookie("jwt",token,{httpOnly:true,maxAge:age*1000})
        
        res.status(200).json({mssg:"access granted redirect to the home "});

     }catch(err){

      const message=loginERROR(err);
      
      res.status(400).json({message})
     }
  


}
 module.exports.signUphandler= async (req,res)=>{

  
    const {name ,userName, password, email} =req.body;
 try {
    const user= await  User.create( {name ,userName, password, email});
    const token= createToken(user._id, user.userName);
    res.cookie("jwt",token,{httpOnly:true,maxAge:age*1000});

    res.status(200).json({mssg:"access graanted redirect to the home ",user});

 }
 catch(err){
   
   const errors=signUpErrorhandler(err);
   res.status(400).json({errors})

 }


 }

 module.exports.logOutHandler=(req,res)=>{

   
    res.status(200).json({mssg:"loged out successfully"})
 }