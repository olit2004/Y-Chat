import React, { useState } from 'react'
import googleLogo from '/src/assets/icons/google.svg'
import axios from 'axios';

import { useNavigate } from 'react-router-dom';



function AuthForm({ title }) {

  const navigate = useNavigate()

  const signup = title == "signup";
  const [loginError, setLoginError] = useState("")
  const [signupError, setSignupError] = useState({
    userName: '',
    email: '',
    password: ''
  })

  const [FormData, setFormData] = useState({
    userName: '',
    password: '',
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e) => {
    // the functin for handling submit goes here
    e.preventDefault();
    setLoginError("")
    setSignupError({
      userName: '',
      password: '',
      name: '',
      email: ''
    })
    console.log(" the data that user submitted is ", FormData)
    handleAuth(FormData);
  }

  const handleAuth = async (data) => {

    try {
      const res = await axios.post(`http://localhost:3000/${title}`, data, { withCredentials: true })
      console.log("the server responded with the following", res.data)
      navigate('/')

    }
    catch (err) {

      if (err.response && err.response.data && err.response.data.message) {
        setLoginError(err.response.data.message);
        console.log("Login failed:");
      }
      else if (err.response && err.response.data && err.response.data.errors) {
        setSignupError(err.response.data.errors)

      }


      else {

        setLoginError("Unexpected error:")
        setSignupError((prev) = ({ ...prev, message: "Unexpected error:" }))
        console.log("Unexpected error:");
      }


    }


  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col'>

      {signup &&
        <>
          <label htmlFor="name"
            className='block w-full text-lg text-gray-800'>
            Full Name:
          </label>
          <input type="text"
            id="name"
            name='name'
            value={FormData.name}
            placeholder='enter your full name'
            onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
            className='border-none bg-gray-200 rounded text-gray-900 m-3 h-10 md:h-8 p-2 w-full md:w-2/3'
          />
        </>}



      <label htmlFor="userName"
        className='block w-full text-lg text-gray-800'>
        userName:
      </label>
      <input type="text"
        id="userName"
        name='userName'
        value={FormData.userName}
        placeholder='enter your userName'
        onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
        className='border-none bg-gray-200 rounded text-gray-900 m-3 h-10 md:h-8 p-2 w-full md:w-2/3'
      />

      {signup && signupError.userName && (<h2 className='text-sm text-red-500'>ERROR :{signupError.userName}</h2>)}

      <label htmlFor="password"
        className='block w-full text-sm text-gray-800'>
        pasword:
      </label>
      <input type="password"
        id="pasword"
        name='password'
        value={FormData.password}
        placeholder="Enter your password"
        onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
        className='border-0 bg-gray-200 rounded text-gray-900 m-3 h-10 md:h-8 p-2 w-full md:w-2/3 focus:border focus:border-blue-500'

      />
      {signup && signupError.password && (<h2 className='text-lg text-red-500'>ERROR :{signupError.password}</h2>)}


      {!signup && loginError && (<h2 className='text-lg text-red-500'>ERROR :{loginError}</h2>)}
      {signup && <>
        <label htmlFor="email"
          className='block w-full text-lg text-gray-800'>
          email:
        </label>
        <input type="email"
          id="email"
          name='email'
          value={FormData.email}
          placeholder='enter your userName'
          onChange={(e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          className='border-none bg-gray-200 rounded text-gray-900 m-3 h-10 md:h-8 p-2 w-full md:w-2/3'
        />
        {signup && signupError.email && (<h2 className='text-lg text-red-500'>ERROR :{signupError.email}</h2>)}


      </>}
      {signup && signupError.message && (<h2 className='text-lg text-red-500'>ERROR :{signupError.message}</h2>)}


      <div className="flex flex-col sm:flex-row px-5 gap-4 sm:gap-10 mt-5 md:mx-10 items-center justify-center md:justify-start">
        <button type="submit" className='w-full sm:w-auto bg-blue-500 px-6 py-2 rounded text-xl text-white cursor-pointer hover:bg-blue-400'>
          {title}
        </button>
        <button type="button" onClick={() => navigate(signup ? "/auth/login" : "/auth/signup")} className='w-full sm:w-auto border-2 border-sky-300 px-6 py-2 rounded text-xl text-blue-600 cursor-pointer hover:bg-blue-500 hover:text-white '>
          {signup ? "Login" : "Signup"}
        </button>
      </div>
      <div className="mx-5 md:mx-10 my-4 p-2 border-2 border-gray-700 rounded-2xl flex gap-3 items-center justify-center w-full max-w-[220px] text-gray-900 hover:bg-gray-800 hover:text-white cursor-pointer">

        {/* to be implemented */}
        <img src={googleLogo} alt="googleLogo"
          className='w-8' />
        <h3 className='text-lg whitespace-nowrap'>Login with google</h3>
      </div>



    </form>
  )
}

export default AuthForm