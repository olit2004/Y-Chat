const express = require('express');
const authController = require('../controller/authController')

const route= express.Router();

//  auth routes 
route.post('/login',authController.loginHandler);
route.post('/signup',authController.signUphandler);
route.get('/logout',authController.logOutHandler);

module.exports= route;