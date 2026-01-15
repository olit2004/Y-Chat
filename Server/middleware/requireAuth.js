const jwt = require ("jsonwebtoken");
const User= require('../models/User')
require('dotenv').config()


const secret = process.env.JWT_SECRET;

const requireAuth= (req,res,next)=>{

    const token=req.cookies.jwt;
 
    if (token){
    
    
       jwt.verify(token,secret,(error,decoded)=>{
        if (error){
     

            console.log(error)
             return res.status(401).json({ message: "invalid token" })
        }
        else{
     

            req.user=decoded
            next()
        }
       })
    }
    else{
       
       return res.status(401).json({ message: "No token provided" })
    }
    

}


module.exports=requireAuth;
